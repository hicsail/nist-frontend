import { CodegenConfig } from '@graphql-codegen/cli'


const config: CodegenConfig = {
  schema: `https://nist-staging-gateway.sail.codes/graphql`,
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    }
  }
}

export default config
