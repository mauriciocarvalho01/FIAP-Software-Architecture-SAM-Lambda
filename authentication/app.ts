import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import https from 'https';
import http from 'http';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

type GenericType<T = any> = any

const API_URL = process.env.API_URL ?? 'http://localhost:3000'
const API_ACCESS_TOKEN = process.env.API_ACCESS_TOKEN ?? ''


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const cnpj = event.queryStringParameters?.cnpj
        const authorization = event.headers?.Authorization

        if (!cnpj) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'CNPJ is required', event }),
            }
        }

        const isClientAuthorized = await authorize(cnp, authorization)

        if (!isClientAuthorized) {
            return {
                statusCode: 403,
                body: JSON.stringify({ message: 'Unauthorized access' }),
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify(isClientAuthorized),
        }
    } catch (error: GenericType) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message ?? 'Internal server error' }),
        }
    }
};

const authorize = async (cnpj: string, authorization: string): Promise<GenericType> => {
    const rootApiUrl = API_URL
    const url = `${rootApiUrl}/v1/api/client?cpf=${cnpj}`
    const request = url.includes('https') ? https : http

    return new Promise((resolve, reject) => {
        const req = request.get(url, { headers: { Authorization: authorization  ?? API_ACCESS_TOKEN } }, (res) => {
            let data = ''

            res.on('data', (chunk: GenericType) => {
                data += chunk
            })

            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(data))
                } else {
                    resolve(false)
                }
            })
        })

        req.on('error', (error: GenericType) => {
            console.log(error)
            reject(false)
        })

        req.end()
    })
}

