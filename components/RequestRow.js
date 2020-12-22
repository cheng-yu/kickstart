import { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {

	state = {
		loading: false,
		errorMessage: ''
	};

	onApprove = async () => {

		this.setState({ loading: true, errorMessage: ''});

		const campaign = Campaign(this.props.address);
		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.approveRequest(this.props.id).send({
				from: accounts[0]
			});

			Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
		} catch(err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	onFinalize = async () => {

		this.setState({ loading: true, errorMessage: '' });

		const campaign = Campaign(this.props.address);
		try {
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.finalizeRequest(this.props.id).send({
				from: accounts[0]
			});

			Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
		} catch(err) {
			this.setState({ errorMessage: err.message });
		}
		this.setState({ loading: false });
	}

	render() {
		const { Row, Cell } = Table;
		const { id, request, approverCount } = this.props;
		const readyToFinalize = request.approvalCount > approverCount / 2;

		return (
			<Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
				<Cell>{id}</Cell>
				<Cell>{request.description}</Cell>
				<Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
				<Cell>{request.recipient}</Cell>
				<Cell>{request.approvalCount}/{approverCount}</Cell>
				<Cell>
					{request.complete ? null :
						<Button color='green' basic onClick={this.onApprove} loading={this.state.loading}>Approve</Button>
					}
				</Cell>
				<Cell>
					{request.complete ? null :
						<Button color='blue' basic onClick={this.onFinalize} loading={this.state.loading}>Finalize</Button>
					}
				</Cell>
			</Row>
		);
	}
}

export default RequestRow;
