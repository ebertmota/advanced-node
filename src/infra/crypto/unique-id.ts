import { UUIDGenerator } from '@/domain/contracts/gateways';

export class UniqueId implements UUIDGenerator {
  generate({ key }: UUIDGenerator.Input): string {
    const currentDate = new Date();
    const x =
      currentDate.getFullYear() +
      this.format(currentDate.getMonth() + 1) +
      this.format(currentDate.getDate()) +
      this.format(currentDate.getHours()) +
      this.format(currentDate.getMinutes()) +
      this.format(currentDate.getSeconds());

    return `${key}_${x}`;
  }

  format(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
