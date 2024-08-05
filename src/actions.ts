"use server";

import { IronSession } from "iron-session";
import { getIronSession } from "iron-session";
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { sessionOptions, SessionData, defaultSession, User } from './lib';
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


export const getUserCompanies = async () => {
  try {
    // Get the current session to identify the user
    const session = await getSession();

  if (!session.isLoggedIn || !session.user) {
    throw new Error("You must be logged in to view your companies.");
  }
  const userId = session.user?.id;


  // Query the user_roles table to find company IDs associated with the user
  const data = await sql`
    SELECT companies.id, companies.name
    FROM user_roles
    JOIN companies ON user_roles.company_id = companies.id
    WHERE user_roles.user_id = ${userId}
  `;

  // Map the results to a more usable structure if necessary
  const userCompanies = data.rows.map(company => ({
    id: company.id,
    name: company.name,
  }));

  return userCompanies;
} catch (error) {
  console.error('Database Error:', error);
  throw new Error('Failed to fetch the user companies.');
}}
