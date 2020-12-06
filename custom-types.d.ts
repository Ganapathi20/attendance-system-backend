import { ICourse } from "./src/models/course";
import { IStudent } from "./src/models/student";
import { ITeacher } from "./src/models/teacher";

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        // GITHUB_AUTH_TOKEN: string;
        // NODE_ENV: 'development' | 'production';
        // PORT?: string;
        // PWD: string;
        MONGO_CON_STRING: string;
        JWT_SECRET: string;
      }
    }
    namespace Express {
      interface Request {
        userId?: string;
        student: IStudent;
        teacher: ITeacher;
        newCourse: ICourse;
        [key: string]: any;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}