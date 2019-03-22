



export class Recipient {
  constructor(destinationAddress: string, amount: string) {
    this.destinationAddress = destinationAddress;
    this.amount = amount;
  }

  destinationAddress: string;
  amount: string;
}

export class SendCoinBuilding {
  constructor(walletName: string, accountName: string, password: string, deposit_eth: string, receive_xels: string, xels_address: string, feeAmount: number, allowUnconfirmed: boolean) {
    this.walletName = walletName;
    this.accountName = accountName;
    this.password = password;
    this.recipients = [new Recipient(xels_address, deposit_eth)];
    this.feeAmount = feeAmount;
    this.allowUnconfirmed = allowUnconfirmed;
    this.deposit_eth = deposit_eth;
    this.xels_address = xels_address;
  }

  walletName: string;
  accountName: string;
  password: string;
  recipients: Recipient[];
  feeAmount: number;
  allowUnconfirmed: boolean;
  shuffleOutputs: boolean;
  deposit_eth: string;
  receive_xels: string;
  xels_address: string;
}
