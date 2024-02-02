// DEFINE CREDs FOR TYPEORM

import config from "config";

// DATA SOURCE
import { DataSource } from "typeorm";

// ENTITIES
import { Patient } from "../entity/MstPatient";
import { Appointment } from "../entity/TrnAppointment";
import { Medicine } from "../entity/MstMedicine";
import { ClinicAuth } from "../entity/ClinicAuth";
import { ClinicData } from "../entity/ClinicData";
import { Session } from "../entity/Session";


export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.get<string>('dbCred.host'),
  username: config.get<string>('dbCred.userName'),
  password: config.get<string>('dbCred.password'),
  database: config.get<string>('dbCred.dbName'),
  logging: true,
  // synchronize: true,
  entities: [ Patient, Appointment, Medicine, ClinicAuth, ClinicData, Session],
  timezone: 'local',
})