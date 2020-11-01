import { getRepository, Repository, Raw, Between } from 'typeorm';
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment || undefined;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const anyDateInMonthYear = new Date(year, month, 1);

    // Outra solucao independente de postgres
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const appointments1 = await this.ormRepository.find({
      where: {
        provider_id,
        date: Between(
          startOfMonth(anyDateInMonthYear),
          endOfMonth(anyDateInMonthYear),
        ),
      },
    });

    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    month,
    year,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const anyHourInDayMonthYear = new Date(year, month, day);

    // Outra solucao independente de postgres
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const appointments1 = await this.ormRepository.find({
      where: {
        provider_id,
        date: Between(
          startOfDay(anyHourInDayMonthYear),
          endOfDay(anyHourInDayMonthYear),
        ),
      },
      relations: ['user'],
    });

    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      // mesmo efeito que o eager na entity
      relations: ['user'],
    });

    return appointments;
  }
}

export default AppointmentsRepository;
