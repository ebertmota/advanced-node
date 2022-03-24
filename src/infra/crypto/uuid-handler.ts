import { v4 } from 'uuid';
import { UUIDGenerator } from '@/domain/contracts/gateways';

export class UUIDHandler implements UUIDGenerator {
  generate(input: UUIDGenerator.Input): string {
    v4();
    return '';
  }
}
