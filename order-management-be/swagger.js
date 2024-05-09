export const swaggerDocument = {
	openapi: '3.0.0',
	info: {
		title: 'Order Management Tool',
		description: 'API for managing orders',
		version: '1.0.0'
	},
	servers: [
		{
			url: 'http://localhost:8080/api'
		}
	],
	components: {
		securitySchemes: {
			BearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT'
			}
		}
	},
	paths: {
		'/user/register': {
			post: {
				summary: 'Register a new user',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									firstName: {
										type: 'string',
										example: 'John'
									},
									lastName: {
										type: 'string',
										example: 'Doe'
									},
									phoneNumber: {
										type: 'number',
										example: 6514265140
									},
									email: {
										type: 'string',
										format: 'email',
										example: 'john@example.com'
									},
									password: {
										type: 'string',
										pattern: '^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
										example: 'U2FsdGVkX1+ILQ91VejAVpr/xiaq/Mf0XsHxR7fEKR4=',
										description: 'Password@123'
									}
								}
							}
						}
					}
				},
				responses: {
					201: {
						description: 'Created'
					},
					400: {
						description: 'Bad Request'
					}
				},
				tags: ['Users']
			}
		},
		'/user/login': {
			post: {
				summary: 'Login as an user',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										format: 'email',
										example: 'john@example.com'
									},
									password: {
										type: 'string',
										pattern: '^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
										example: 'U2FsdGVkX1+ILQ91VejAVpr/xiaq/Mf0XsHxR7fEKR4=',
										description: 'Password@123'
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					401: {
						description: 'Unauthorized'
					},
					404: {
						description: 'Not Found'
					},
					403: {
						description: 'Forbidden'
					}
				},
				tags: ['Users']
			}
		},
		'/user/verify': {
			post: {
				summary: 'Verify user account',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										format: 'email',
										example: 'john@example.com'
									},
									expires: {
										type: 'string',
										format: 'number',
										example: '1715277149154'
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					404: {
						description: 'Not Found'
					},
					410: {
						description: 'Gone'
					}
				},
				tags: ['Users']
			}
		},
		'/user/forget': {
			post: {
				summary: 'Send password reset email',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										format: 'email',
										example: 'john@example.com'
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					403: {
						description: 'Forbidden'
					}
				},
				tags: ['Users']
			}
		},
		'/user/reset': {
			post: {
				summary: 'Reset user password',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										format: 'email',
										example: 'john@example.com'
									},
									newPassword: {
										type: 'string',
										pattern: '^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
										example: 'U2FsdGVkX1+ILQ91VejAVpr/xiaq/Mf0XsHxR7fEKR4=',
										description: 'Password@123'
									},
									expires: {
										type: 'string',
										format: 'number',
										example: '1714932121605'
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					403: {
						description: 'Forbidden'
					},
					410: {
						description: 'Gone'
					}
				},
				tags: ['Users']
			}
		},
		'/user/invite': {
			post: {
				summary: 'Invite a user',
				security: [
					{
						BearerAuth: []
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									email: {
										type: 'string',
										format: 'email',
										example: 'john@example.com'
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					},
					409: {
						description: 'Conflict'
					}
				},
				tags: ['Invite']
			},
			get: {
				tags: ['Invite'],
				summary: 'List invites',
				security: [
					{
						BearerAuth: []
					}
				],
				parameters: [
					{
						in: 'query',
						name: 'limit',
						type: 'integer'
					},
					{
						in: 'query',
						name: 'skip',
						type: 'integer'
					},
					{
						in: 'query',
						name: 'sort_key',
						type: 'string'
					},
					{
						in: 'query',
						name: 'sort_order',
						type: 'string'
					},
					{
						in: 'query',
						name: 'filter_key',
						type: 'string'
					},
					{
						in: 'query',
						name: 'filter_value',
						type: 'string'
					}
				],
				responses: {
					200: {
						description: 'OK'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					}
				}
			}
		},
		'/user/invite/{id}': {
			delete: {
				tags: ['Invite'],
				summary: 'Remove invite',
				security: [
					{
						BearerAuth: []
					}
				],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true,
						type: 'string'
					}
				],
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad Request'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					},
					404: {
						description: 'Not Found'
					}
				}
			}
		},
		'/hotel': {
			post: {
				tags: ['Hotel'],
				summary: 'Create a new hotel',
				security: [
					{
						BearerAuth: []
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
										required: true
									},
									address: {
										type: 'string',
										required: true
									},
									careNumber: {
										type: 'string',
										required: true
									},
									manager: {
										type: 'array',
										items: {
											type: 'string'
										}
									},
									openTime: {
										type: 'string'
									},
									closeTime: {
										type: 'string'
									}
								}
							}
						}
					}
				},
				responses: {
					201: {
						description: 'Created'
					},
					400: {
						description: 'Bad request'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					}
				}
			},
			get: {
				summary: 'Get a list of hotels',
				tags: ['Hotel'],
				security: [
					{
						BearerAuth: []
					}
				],
				responses: {
					200: {
						description: 'Successful response'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					}
				}
			}
		},
		'/hotel/{id}': {
			put: {
				tags: ['Hotel'],
				summary: 'Update an existing hotel',
				security: [
					{
						BearerAuth: []
					}
				],
				parameters: [
					{
						in: 'path',
						name: 'id',
						required: true
					}
				],
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									name: {
										type: 'string'
									},
									address: {
										type: 'string'
									},
									careNumber: {
										type: 'string'
									},
									openTime: {
										type: 'string'
									},
									closeTime: {
										type: 'string'
									}
								}
							}
						}
					}
				},
				responses: {
					200: {
						description: 'OK'
					},
					400: {
						description: 'Bad request'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					}
				}
			},
			delete: {
				tags: ['Hotel'],
				security: [
					{
						BearerAuth: []
					}
				],
				summary: 'Delete a hotel by ID',
				parameters: [
					{
						name: 'id',
						in: 'path',
						description: 'ID of the hotel to delete',
						required: true,
						type: 'string'
					}
				],
				responses: {
					200: {
						description: 'Hotel deleted successfully'
					},
					401: {
						description: 'Unauthorized'
					},
					403: {
						description: 'Forbidden'
					}
				}
			}
		}
	}
};
