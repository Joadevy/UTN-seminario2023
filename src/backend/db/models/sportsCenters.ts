/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type {Prisma, SportCenter} from "@prisma/client";

import {db} from "../db";

import {getUserByEmail} from "./users";

export const SPORT_CENTER_PENDING = "pending";

export const SPORT_CENTER_APPROVED = "approved";

export const SPORT_CENTER_REJECTED = "rejected";

export const SPORT_CENTER_CANCELED = "canceled";

export type SportCentersWithCourtsAndAppointments = Prisma.SportCenterGetPayload<{
  include: {
    user: true;
    courts: {
      include: {
        appointments: true;
      };
    };
  };
}>;

export const getSportCentersWithCourtsByFilters = async (
  postCode: string,
  sport: string,
  date: Date,
  time: number,
): Promise<SportCentersWithCourtsAndAppointments[]> => {
  return await db.sportCenter.findMany({
    where: {
      city: {
        postCode: postCode,
      },
      active: true, // de los que estan activos
      courts: {
        some: {
          sport: {
            name: sport,
          },
          appointments: {
            some: {
              date: {
                equals: date,
              },
              startTime: {
                gte: time,
              },
            },
          },
        },
      },
    },
    include: {
      courts: {
        include: {
          appointments: {
            where: {
              reservations: {
                none: {
                  state: {
                    in: ["approved", "pending"],
                  },
                },
              },
            },
          },
        },
      },
      user: true,
    },
  });
};

export const getUserPendingSportCenters = async (
  userEmail: string,
): Promise<SportCenter[] | null> => {
  const user = await getUserByEmail(userEmail);

  if (user) {
    return await db.sportCenter.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  return null;
};

export const getSportCentersByState = async (state: string): Promise<SportCenter[] | null> => {
  return await db.sportCenter
    .findMany({
      where: {
        state,
      },
    })
    .catch(() => null);
};
