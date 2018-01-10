import { CountryFactory } from '../country/country.factory';
import { FactoryHelper } from '../factory-helper';
import { AddressData } from './address.interface';
import { Address } from './address.model';

export class AddressFactory {

  static fromData(data: AddressData): Address {
    const address: Address = new Address();
    FactoryHelper.primitiveMapping<AddressData, Address>(data, address);
    if (data.country) {
      address.country = CountryFactory.fromData(data.country);
    }
    return address;
  }
}
