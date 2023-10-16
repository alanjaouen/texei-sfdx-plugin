import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('texei-sfdx-plugin', 'skinnyprofile.create');

export type SkinnyprofileCreateResult = {
  name: string;
  time: string;
};

export default class Create extends SfCommand<SkinnyprofileCreateResult> {
  // Minimum Access - Salesforce
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'target-org': Flags.requiredOrg(),
    'api-version': Flags.orgApiVersion(),
    name: Flags.string({ char: 'n', required: false, summary: messages.getMessage('flags.name.summary') }),
  };

  public async run(): Promise<SkinnyprofileCreateResult> {
    const { flags } = await this.parse(Create);
    const time = new Date().toDateString();

    // Initialize the authorization for the provided username
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    // const authInfo = await AuthInfo.create({ username: flags.username });

    // Create a connection to the org
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const connection = flags['target-org']?.getConnection(flags['api-version']);

    const fullNames = ['Minimum Access - Salesforce'];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const res = await connection?.metadata.read('Profile', fullNames);
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(res));

    // const desc = await connection?.tooling.sobject('Profile').describe();
    // const desc = await connection?.sobject('Profile').describe();
    // eslint-disable-next-line @typescript-eslint/quotes
    const desc = await connection?.tooling.query(
      `Select Metadata from Profile where Name = 'Minimum Access - Salesforce'`
    );
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(desc));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (res) {
      res[0].fullName = flags.name;
    }

    /*
    // @ts-ignore: whatever
    const res2 = await connection?.metadata.create('Profile', res);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(res2));
    */

    return {
      name: 'flags.name',
      time,
    };
  }
}
