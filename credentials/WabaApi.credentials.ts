import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WabaApi implements ICredentialType {
	name = 'wabaApi';
	displayName = 'WABA API';
	documentationUrl = 'https://waba.nxccontrols.in/blog/how-to-connect-whatsapp-business-api-to-n8n';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://waba.nxccontrols.in',
			placeholder: 'https://waba.nxccontrols.in',
			description: 'The base URL for the WABA API',
		},
		{
			displayName: 'App Key',
			name: 'appKey',
			type: 'string',
			default: '',
			required: true,
			description: 'Your WABA application key',
		},
		{
			displayName: 'Auth Key',
			name: 'authKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your WABA authentication key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				appkey: '={{$credentials.appKey}}',
				authkey: '={{$credentials.authKey}}',
			},
		},
	};
}
