"use server";

import { IronSession } from "iron-session";
import { getIronSession } from "iron-session";
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import { sessionOptions, SessionData, defaultSession, User } from './lib';
import { redirect } from "next/navigation";
import { useRouter } from 'next/router'

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
