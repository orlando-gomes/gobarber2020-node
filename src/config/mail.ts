interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'email.configurado.na.aws@example.com',
      name: 'Nome Que Você Quiser',
    },
  },
} as IMailConfig;
