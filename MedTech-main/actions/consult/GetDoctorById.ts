"use server";

import { db } from "@/lib/db";

export const GetDoctorById = async (id: string) => {
  try {
    const doctor = await db.user.findFirst({
      where: {
        id: id,
        role: 'DOCTOR',
      },
    });

    if (!doctor) {
      console.error(`Doctor with ID ${id} not found.`);
      return null;
    }

    const profile = await db.doctorProfile.findFirst({
      where: {
        userId: doctor.id,
      },
    });

    const availability = await db.doctorAvailabilityDetails.findFirst({
      where: {
        userId: doctor.id,
      },
    });

    const doctorWithDetails = {
      ...doctor,
      profile,
      availability,
    };

    return doctorWithDetails;
  } catch (error) {
    console.error('Error fetching doctor with details:', error);
    return null;
  }
};
