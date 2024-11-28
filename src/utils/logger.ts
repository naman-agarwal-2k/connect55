import winston from "winston";
const {combine, label,printf,timestamp}= winston.format;

export default class Logger{
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor(){
        this.logger=winston.createLogger({
            level:process.env.NODE_ENV === "prod"? "info":"silly",
            format: this.getFormat(process.env.NODE_ENV,'default'),
            transports:[new winston.transports.Console()],
        });
    }
    public static getInstance(): Logger{
if(!this.instance){
   this.instance = new Logger(); 
}
return this.instance;
    }

    public getLogger(module: string): winston.Logger{
        return winston.createLogger({
            level: process.env.NODE_ENV === "prod" ? "info" : "silly",
            format: this.getFormat(process.env.NODE_ENV, module),
            transports: [new winston.transports.Console()],
        })
    }
    
      private getFormat(env: string | undefined, module: string) {
        const customFormat = printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${message}`;
        });
        if (env === "local") {
          return combine(
            winston.format.colorize({ all: true }),
            label({ label: module }),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            customFormat
          );
        } else {
          return combine(
            label({ label: module }),
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            customFormat
          );
        }
      }
    
      public info(message: string) {
        this.logger.info(message);
      }
    
      public error(message: string, err: unknown) {
        this.logger.error(`${message} - ${err instanceof Error ? err.message : err}`);
      }
    }