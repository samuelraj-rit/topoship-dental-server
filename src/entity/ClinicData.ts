import { Entity, PrimaryColumn, Column, BaseEntity, OneToOne, JoinColumn, BeforeInsert } from "typeorm";
import { AppDataSource } from "../utils/data-source";

import { ClinicAuth } from "./ClinicAuth";

@Entity('clinic_data')
export class ClinicData extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 20, nullable: false })
  clinic_id!: string;

  // Basic Information
  @Column({ type: 'varchar', length: 150, nullable: false })
  clinic_name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', nullable: false })
  address!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phone_number!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accreditation_body?: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registration_date!: Date;

  @Column({ type: 'timestamp', nullable: true })
  accreditation_expiry_date?: Date | null;

  // Additional Features
  @Column({ type: 'json', nullable: true })
  additional_information?: Record<string, any> | null;

  // Authentication and Security
  @Column({ type: 'boolean', default: false })
  is_two_factor_authentication_enabled!: boolean;

  // Timestamp columns
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // @OneToOne(() => ClinicAuth, { cascade: true })
  // @JoinColumn()
  // clinic_auth!: ClinicAuth;

  @BeforeInsert()
  async createSelfId() {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currCode = `${currentYear.toString().slice(2)}${currentMonth.toString().padStart(2, '0')}`;

    const latestSelf = await AppDataSource
      .getRepository(ClinicData)
      .createQueryBuilder('clinic_data')
      .orderBy('clinic_data.created_at', 'DESC')
      .getOne();

    let nextId;
    if (latestSelf) {
      const lastSelfId = latestSelf.clinic_id;
      const lastSelfCode = lastSelfId.substring(4, 8);

      if (lastSelfCode === currCode) {
        const lastSelfNum = parseInt(lastSelfId.substring(8), 10);
        const nextSelfNum = lastSelfNum + 1;
        nextId = `CLI_${currCode}${nextSelfNum.toString().padStart(4, '0')}`;
      } else {
        nextId = `CLI_${currCode}0001`;
      }
    } else {
      nextId = `CLI_${currCode}0001`;
    }

    this.clinic_id = nextId;
  }

}