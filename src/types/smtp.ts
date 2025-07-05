export interface SmtpConfigInput {
    host: string
    port: number
    username: string
    password: string
    secure: boolean
  }
  
  export function validateSmtpInput(input: Partial<SmtpConfigInput>): input is SmtpConfigInput {
    return (
      typeof input.host === 'string' &&
      typeof input.port === 'number' &&
      typeof input.username === 'string' &&
      typeof input.password === 'string' &&
      typeof input.secure === 'boolean'
    )
  }