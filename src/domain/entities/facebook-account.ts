type FacebookData = {
  name: string;
  email: string;
  facebook_id: string;
};

type AccountData = {
  id?: string;
  name?: string;
};

export class FacebookAccount {
  id?: string;

  name: string;

  email: string;

  facebook_id: string;

  constructor(fbData: FacebookData, accountData?: AccountData) {
    this.id = accountData?.id;
    this.name = accountData?.name ?? fbData.name;
    this.email = fbData.email;
    this.facebook_id = fbData.facebook_id;
  }
}
