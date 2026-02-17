import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Waba implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WABA',
		name: 'waba',
		icon: 'file:waba.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send messages and manage templates via WABA API',
		defaults: {
			name: 'WABA',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'wabaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Template',
						value: 'template',
					},
				],
				default: 'message',
			},
			// Message Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Send Template',
						value: 'sendTemplate',
						description: 'Send a templated message',
						action: 'Send a templated message',
					},
					{
						name: 'Send Freeform',
						value: 'sendFreeform',
						description: 'Send a free-form reply message',
						action: 'Send a freeform message',
					},
				],
				default: 'sendTemplate',
			},
			// Template Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['template'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all approved templates',
						action: 'Get all approved templates',
					},
				],
				default: 'getAll',
			},

			// =====================================
			// Message: Send Template Fields
			// =====================================
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendTemplate'],
					},
				},
				default: '',
				placeholder: '919876543210',
				description: 'Recipient phone number (with country code)',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendTemplate'],
					},
				},
				default: '',
				description: 'The template ID to use',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendTemplate'],
					},
				},
				default: 'en',
				description: 'Template language code',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendTemplate'],
					},
				},
				options: [
					{
						displayName: 'Variables',
						name: 'variables',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Template variables',
						options: [
							{
								name: 'variable',
								displayName: 'Variable',
								values: [
									{
										displayName: 'Key',
										name: 'key',
										type: 'string',
										default: '',
										description: 'Variable name (e.g., v1, v2)',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Variable value',
									},
								],
							},
						],
					},
					{
						displayName: 'Buttons',
						name: 'buttons',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: 'Template buttons',
						options: [
							{
								name: 'button',
								displayName: 'Button',
								values: [
									{
										displayName: 'Key',
										name: 'key',
										type: 'string',
										default: '',
										description: 'Button key (e.g., b1_type, b1_value)',
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: 'Button value',
									},
								],
							},
						],
					},
					{
						displayName: 'File',
						name: 'file',
						type: 'string',
						default: '',
						description: 'File URL or base64 string',
					},
					{
						displayName: 'File Name',
						name: 'fileName',
						type: 'string',
						default: '',
						description: 'File name (when file is provided)',
					},
				],
			},

			// =====================================
			// Message: Send Freeform Fields
			// =====================================
			{
				displayName: 'To',
				name: 'toFreeform',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendFreeform'],
					},
				},
				default: '',
				placeholder: '919876543210,919876543211',
				description: 'Recipient phone number(s), comma-separated for multiple',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendFreeform'],
					},
				},
				default: '',
				description: 'The free-form message text to send',
			},
			{
				displayName: 'Quick Reply Buttons',
				name: 'quickReplyButtons',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['sendFreeform'],
					},
				},
				description: 'Optional quick reply buttons',
				options: [
					{
						name: 'button',
						displayName: 'Button',
						values: [
							{
								displayName: 'Button Number',
								name: 'buttonNumber',
								type: 'number',
								default: 1,
								description: 'Button number (1, 2, 3, etc.)',
							},
							{
								displayName: 'Button Text',
								name: 'buttonText',
								type: 'string',
								default: '',
								description: 'Button text to display',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const credentials = await this.getCredentials('wabaApi');
		const apiUrl = (credentials.apiUrl as string).replace(/\/$/, '');
		const appKey = credentials.appKey as string;
		const authKey = credentials.authKey as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'message') {
					if (operation === 'sendTemplate') {
						// Send Template Message
						const to = this.getNodeParameter('to', i) as string;
						const templateId = this.getNodeParameter('templateId', i) as string;
						const language = this.getNodeParameter('language', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as any;

						const body: any = {
							appkey: appKey,
							authkey: authKey,
							to,
							template_id: templateId,
							language,
						};

						// Process variables
						if (additionalFields.variables?.variable) {
							const variables: any = {};
							for (const v of additionalFields.variables.variable) {
								variables[v.key] = v.value;
							}
							body.variables = variables;
						}

						// Process buttons
						if (additionalFields.buttons?.button) {
							const buttons: any = {};
							for (const b of additionalFields.buttons.button) {
								buttons[b.key] = b.value;
							}
							body.buttons = buttons;
						}

						// Add file if provided
						if (additionalFields.file) {
							body.file = additionalFields.file;
							if (additionalFields.fileName) {
								body.file_name = additionalFields.fileName;
							}
						}

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${apiUrl}/api/create-message`,
							body,
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });

					} else if (operation === 'sendFreeform') {
						// Send Freeform Message
						const toRaw = this.getNodeParameter('toFreeform', i) as string;
						const message = this.getNodeParameter('message', i) as string;
						const quickReplyButtons = this.getNodeParameter('quickReplyButtons', i) as any;

						// Convert comma-separated string to array
						const toArray = toRaw.split(',').map(num => num.trim());

						const body: any = {
							appkey: appKey,
							authkey: authKey,
							to: toArray,
							template_id: 'chat_reply',
							language: 'en',
							message,
						};

						// Process quick reply buttons
						if (quickReplyButtons?.button && quickReplyButtons.button.length > 0) {
							const buttons: any = {};
							for (const btn of quickReplyButtons.button) {
								const num = btn.buttonNumber;
								buttons[`b${num}_type`] = 'quick_reply';
								buttons[`b${num}_value`] = btn.buttonText;
							}
							body.buttons = buttons;
						}

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${apiUrl}/api/create-message-json`,
							body,
							json: true,
						});

						returnData.push({ json: response, pairedItem: { item: i } });
					}
				} else if (resource === 'template') {
					if (operation === 'getAll') {
						// Get All Templates
						const body = {
							appkey: appKey,
							authkey: authKey,
						};

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url: `${apiUrl}/api/get_templates`,
							body,
							json: true,
						});

						// Return only approved templates
						if (response.data && Array.isArray(response.data)) {
							const approvedTemplates = response.data.filter(
								(t: any) => t.status === 'APPROVED',
							);
							for (const template of approvedTemplates) {
								returnData.push({ json: template, pairedItem: { item: i } });
							}
						} else {
							returnData.push({ json: response, pairedItem: { item: i } });
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: errorMessage }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
