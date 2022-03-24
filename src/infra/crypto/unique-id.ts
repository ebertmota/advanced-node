import { UUIDGenerator } from '@/domain/contracts/gateways';

export class UniqueId implements UUIDGenerator {
  generate({ key }: UUIDGenerator.Input): string {
    const currentDate = new Date();
    const uniqueValue =
      currentDate.getFullYear() +
      this.format(currentDate.getMonth() + 1) +
      this.format(currentDate.getDate()) +
      this.format(currentDate.getHours()) +
      this.format(currentDate.getMinutes()) +
      this.format(currentDate.getSeconds());

    return `${key}_${uniqueValue}`;
  }

  format(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
