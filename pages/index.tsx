import Head from 'next/head'
import { useQuery, gql } from "@apollo/client"
import {initializeApollo} from "src/apollo"
import styles from '../styles/Home.module.css'

const MyQuery = gql`
  query{
  company(where:{id:1232}){
    name
    description
  }
}
`

export default function Home() {
  const { data, loading, error  } = useQuery(MyQuery)
  if (loading) return <span>Loading...</span>
	if (error) return <span>{error}</span>
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
   </div>

  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query ({
    query: MyQuery
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}