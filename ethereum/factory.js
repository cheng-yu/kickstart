import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';
import Address from '../Address.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    Address.factoryAddress
);

export default instance;