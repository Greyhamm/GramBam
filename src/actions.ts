"use server";

import { IronSession } from "iron-session";
import { getIronSession } from "iron-session";
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { sessionOptions, SessionData, defaultSession, User } from './lib';
import { Company, CreateProjectParams, Project, RecordData, Record} from "./lib";
import { redirect } from "next/navigation";
import { useRouter } from 'next/router'
import { revalidatePath } from "next/cache";
// Get session function to retrieve the current session
export const getSession = async (): Promise<IronSession<SessionData>> => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // Ensure default session values
  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }
  //Add checks for user in database everytime if you want

  return session;
};

// Login function to handle user authentication
export const login = async (
  prevState:{error:undefined | string},
  formData: FormData
) => {
  const session = await getSession();

  const email = formData.get("email") as string;
  const formPassword = formData.get("password") as string;
  console.log(email);
  console.log(formPassword);


  // Check for user in the database
  const { rows: result } = await sql<User>`SELECT * FROM userz WHERE email = ${email}`;

  if (result.length === 0) {
    // Handle case where user is not found
    return { success: false, error: "Invalid username or password" };
  }

  const user = result[0];

  // Compare the provided password with the stored password hash
  const passwordMatch = await bcrypt.compare(formPassword, user.password_hash);

  if (!passwordMatch) {
    // Handle case where password does not match
    return { success: false, error: "Invalid username or password" };
  }

  // Set session data for logged-in user
  session.isLoggedIn = true;
  session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  console.log(session.isLoggedIn);

  await session.save();
  
  redirect("/profile");
};

// Logout function to clear the session data
export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};


export const signup = async (
  prevState: { error: undefined | string },
  formData: FormData
) => {
  const session = await getSession();

  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const formPassword = formData.get("password") as string;

  if (!email || !username || !formPassword) {
    return { success: false, error: "All fields are required" };
  }

  // Check if the user already exists
  const { rows: existingUsers } = await sql`
    SELECT * FROM userz WHERE email = ${email}
  `;

  if (existingUsers.length > 0) {
    return { success: false, error: "User already exists" };
  }

  // Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(formPassword, saltRounds);

  // Insert the new user into the database
  const { rows } = await sql`
    INSERT INTO userz (email, username, password_hash)
    VALUES (${email}, ${username}, ${passwordHash})
    RETURNING id, username
  `;

  const newUser = rows[0];

  // Set session data for the new user
  session.isLoggedIn = true;
  session.user = {
    id: newUser.id,
    username: newUser.username,
    email: email,
  };

  await session.save();

  redirect("/profile");
};


export const createCompany = async (formData: FormData) => {
  const session = await getSession();

  const user = session.user?.username
  const companyName = formData.get("companyName") as string;

  if (!session.isLoggedIn || !session.user) {
    throw new Error("You must be logged in to create a company.");
  }

  const createdBy = session.user?.id;

  // Insert the new company into the companies table
  const { rows: companyRows } = await sql`
    INSERT INTO companies (name, created_at, created_by)
    VALUES (${companyName}, NOW(), ${createdBy})
    RETURNING id
  `;
  // Get the created company's ID
  const companyId = companyRows[0].id;

  // Define the role (you can change 'admin' to any appropriate role)
  const role = 'creator';

  // Insert the user into the user_roles table
  await sql`
    INSERT INTO user_roles (user_id, company_id, role)
    VALUES (${createdBy}, ${companyId}, ${role})
  `;

  revalidatePath("/profile");
}


export const showUserCompanies = async () => {
  const session = await getSession();
  const user = session.user?.id
}


export const getUserCompanies = async (): Promise<Company[]> => {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.user) {
      throw new Error("You must be logged in to view your companies.");
    }
    const userId = session.user.id;

    // Fetch companies associated with the user
    const { rows } = await sql`
      SELECT c.id, c.name
      FROM companies c
      JOIN user_roles ur ON c.id = ur.company_id
      WHERE ur.user_id = ${userId}
    `;

    // Map the results to the Company structure
    const userCompanies: Company[] = rows.map(row => ({
      id: row.id,
      name: row.name,
    }));

    return userCompanies;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the user companies.');
  }
};


export const createProject = async ({
  companyId,
  name,
  description,
  client,
}: CreateProjectParams) => {
  try {
    // Get the current user session
    const session = await getSession();

    if (!session.isLoggedIn || !session.user) {
      throw new Error("You must be logged in to create a project.");
    }

    const userId = session.user.id;

    console.log('Session User ID:', userId); // Debugging output

    // Validate that the lead_user exists in the users table
    const userExists = await sql`
      SELECT 1 FROM userz WHERE id = ${userId} LIMIT 1;
    `;

    if (userExists.rowCount === 0) {
      console.error("Lead user does not exist in the users table:", userId); // More debugging output
      throw new Error("Lead user does not exist.");
    }

    // Insert the new project into the database
    const { rows } = await sql`
      INSERT INTO projects (company_id, name, description, client, lead_user, created_at)
      VALUES (${companyId}, ${name}, ${description}, ${client || null}, ${userId}, NOW())
      RETURNING id
    `;

    console.log('New Project ID:', rows[0].id); // Debugging output

    return rows[0].id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw new Error('Could not create the project.');
  }
};

export const getCompanyProjects = async (companyId: string): Promise<Project[]> => {
  try {
    if (!companyId) {
      throw new Error("Company ID is required.");
    }

    // Fetch projects associated with the company
    const { rows } = await sql`
      SELECT 
        id, 
        company_id, 
        name, 
        description, 
        created_at, 
        client, 
        lead_user 
      FROM projects 
      WHERE company_id = ${companyId}
    `;

    // Map the results to the Project structure
    const companyProjects: Project[] = rows.map(row => ({
      id: row.id,
      company_id: row.company_id,
      name: row.name,
      description: row.description,
      created_at: row.created_at,
      client: row.client,
      lead_user: row.lead_user,
    }));

    return companyProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects.');
  }
};

//Getting project details by id
export const getProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    if (!projectId || projectId.trim() === "") {
      throw new Error("Project ID is required.");
    }

    const { rows } = await sql`
      SELECT
        id,
        company_id,
        name,
        description,
        created_at,
        client,
        lead_user
      FROM projects
      WHERE id = ${projectId}
    `;

    if (rows.length === 0) {
      return null;
    }

    const project: Project = {
      id: rows[0].id,
      company_id: rows[0].company_id,
      name: rows[0].name,
      description: rows[0].description,
      created_at: rows[0].created_at,
      client: rows[0].client,
      lead_user: rows[0].lead_user,
    };

    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw new Error('Failed to fetch project.');
  }
};


export const updateProjectById = async (projectId: string, updatedFields: Partial<Project>): Promise<Project> => {
  try {
    const updateFields = Object.entries(updatedFields)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _], index) => `${key} = $${index + 2}`)
      .join(', ');

    if (!updateFields) {
      throw new Error('No valid fields to update');
    }

    const query = `
      UPDATE projects
      SET ${updateFields}
      WHERE id = $1
      RETURNING *
    `;

    const values = [projectId, ...Object.values(updatedFields).filter(value => value !== undefined)];

    const result = await sql.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Project not found or update failed.");
    }

    const updatedProject: Project = {
      id: result.rows[0].id,
      company_id: result.rows[0].company_id,
      name: result.rows[0].name,
      description: result.rows[0].description,
      created_at: result.rows[0].created_at,
      client: result.rows[0].client,
      lead_user: result.rows[0].lead_user,
    };

    return updatedProject;
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update the project.');
  }
};


export async function createRecord(projectId: string, recordData: RecordData) {
  const { name, description } = recordData;
  const created_at = new Date().toISOString();

  try {
    const result = await sql`
      INSERT INTO records (project_id, name, description, created_at)
      VALUES (${projectId}, ${name}, ${description}, ${created_at})
      RETURNING id, project_id, name, description, created_at
    `;

    return result.rows[0];
  } catch (error) {
    console.error('Error creating record:', error);
    throw new Error('Failed to create record');
  }
}



export async function fetchProjectRecords(projectId: string): Promise<Record[]> {
  try {
    const result = await sql<Record>`
      SELECT id, project_id, name, description, created_at
      FROM records
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC
    `;

    return result.rows;
  } catch (error) {
    console.error('Error fetching project records:', error);
    throw new Error('Failed to fetch project records');
  }
}