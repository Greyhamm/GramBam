import { SessionOptions } from "iron-session";


// Define a new type for session user data without sensitive fields
type SessionUser = Omit<User, 'password_hash'>;

export interface SessionData {
    userId?:string;
    username?:string;
    img?:string;
    company?:string
    isLoggedIn:boolean
    user?: SessionUser;
}

export const defaultSession:SessionData={
    isLoggedIn:false

}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: "grambam-session",
    cookieOptions:{
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",

    }
}

export interface User  {
    id: string;
    username: string;
    email: string;
    password_hash: string;
  };
  
 export interface Company {
    id: string;
    name: string;
  }
  
 export interface ProjectFormProps {
    companies: Company[];
    userId: string | undefined;
  }

export interface CreateProjectParams {
    companyId: string;
    name: string;
    description: string;
    client?: string;
  }


  export interface Project {
    id: string;
    company_id: string;
    name: string;
    description: string;
    created_at: string; // ISO date string
    client?: string;
    lead_user?: string;
  }

export interface RecordData {
    name: string;
    description: string;
  }

export interface Record {
  id: string;
  project_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface RecordPageClientProps {
  record: Record;
  projectId: string;
}

export interface RecordPageProps {
  params: {
    projectId: string;
    recordId: string;
  };
}

export interface Task {
  id: string;
  record_id: string;
  name: string;
  description: string;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
}