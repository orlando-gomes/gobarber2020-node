// import { container } from 'tsyringe';

// import IStorageProvider from './StorageProvider/models/IStorageProvider';
// import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

// import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
// import SESMailProvider from './MailProvider/implementations/SESMailProvider';

import './StorageProvider';
import './MailTemplateProvider';
import './MailProvider';
import './CacheProvider';

/*
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);


container.registerInstance<IMailProvider>(
  'MailProvider',
  mailConfig.driver === 'ethereal'
    ? container.resolve(EtherealMailProvider)
    : container.resolve(SESMailProvider),
);
*/
