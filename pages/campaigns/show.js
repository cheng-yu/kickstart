const { Component } = require("react");
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import getCampaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
	static async getInitialProps(props) {
		const campaign = getCampaign(props.query.address);
		const summary = await campaign.methods.getSummary().call();

		return {
			address: props.query.address,
			minimumContribution: summary[0],
			balance: summary[1],
			requestsCount: summary[2],
			approversCount: summary[3],
			manager: summary[4]
		};
	}

	renderCards() {
		const {
			balance,
			minimumContribution,
			requestsCount,
			approversCount,
			manager
		} = this.props;

		const items = [
			{
				header: manager,
				meta: 'Address of manager',
				description: 'The manager created this campaign',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: minimumContribution,
				meta: 'Minimum contribution amount (wei)',
				description: 'The minimum amount of wei that user have to pay to become an approver of this campaign',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: requestsCount,
				meta: 'Count of requests',
				description: 'The number of requests made by manager to do some neccessory transaction to finish this campaign',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: approversCount,
				meta: 'Count of approvers',
				description: 'The number of approvers who has made a contribution to this campaign',
				style: { overflowWrap: 'break-word' }
			},
			{
				header: web3.utils.fromWei(balance, 'ether'),
				meta: 'Campaign Balance (ether)',
				description: 'How much money this campaign has left to spend',
				style: { overflowWrap: 'break-word' }
			}
		];

		return <Card.Group items={items} />
	}

	render() {
		return (
			<Layout>
				<h3>Campaign Details</h3>
				<Grid>
					<Grid.Row>
						<Grid.Column width={10}>
							{this.renderCards()}
						</Grid.Column>
						<Grid.Column width={6}>
							<ContributeForm address={this.props.address} />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Link route={`/campaigns/${this.props.address}/requests`}>
								<a>
									<Button primary>View Requests</Button>
								</a>
							</Link>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Layout>
		);
	}
}

export default CampaignShow;
