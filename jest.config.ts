import type { Config } from 'jest'
import nextJest from 'next/jest.js'
import dotenv from 'dotenv'

dotenv.config({ path: ".env.development" });

const createJestConfig = nextJest({
    dir: './',
})

const config: Config = {
    moduleDirectories: ["node_modules", "<rootDir>"],
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/components/$1',
    }
}

export default createJestConfig(config)