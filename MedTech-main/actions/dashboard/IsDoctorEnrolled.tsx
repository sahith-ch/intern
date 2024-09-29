"use server"
import { db } from '@/lib/db';


export const IsDoctorEnrolled = async (id:any) => {
    if (id) {
    const profile = await db.doctorProfile.findFirst({
        where: {
          userId:id,
        },
      });
  
      const availability = await db.doctorAvailabilityDetails.findFirst({
        where: {
          userId:id,
        },
      });
      const license = await db.doctorLicense.findFirst({
        where: {
          userId:id,
        },
      });
      if(availability&&license&&profile) {
        return true
      }
    return false;
  } 
  else {
    return false;
  }
};