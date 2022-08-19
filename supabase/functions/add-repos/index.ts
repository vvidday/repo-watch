// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { octokit, supabaseClient } from '../_shared/clients.ts'

type repoInfo = {
  id: number
  url: string
  name: string
}

serve(async (req) => {
  // const { repos }: { repos: string[] } = await req.json()
  const { org }: { org: string } = await req.json()
  const promises: Promise<repoInfo>[] = []

  let rows: repoInfo[]

  if (org !== null && org !== '') {
    rows = await getReposFromOrg(org)
  } else {
    return new Response('Error - org must not be empty')
    // for (const repo of repos) {
    //   const [owner, repo_name] = repo.split('/')
    //   if (owner === '' || repo_name === '') {
    //     return new Response('Error: Ensure repos contains values of format <owner>/<repo_name>')
    //   }
    //   promises.push(getData(owner, repo_name))
    // }
    // rows = []
    // const repoData = await Promise.all(promises)
    // for (const arr of repoData) {
    //   rows.push(arr)
    // }
  }

  const { data, error } = await supabaseClient.from('repo').upsert(rows)
  if (error != null) {
    return new Response(JSON.stringify(rows) + JSON.stringify(error), { headers: { 'Content-Type': 'application/json' } })
  }
  return new Response(JSON.stringify(rows), { headers: { 'Content-Type': 'application/json' } })
})

const getData = async (owner: string, repo_name: string): Promise<repoInfo> => {
  const res = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: owner,
    repo_name: repo_name,
  })
  return {
    id: res.id,
    url: res.html_url,
    name: repo_name,
  }
}

const getReposFromOrg = async (org: string): Promise<repoInfo[]> => {
  const data = await octokit.request('GET /orgs/{org}/repos', { org: org, per_page: 100 })
  const repos: repoInfo[] = []
  for (const repo of data.data) {
    repos.push({
      id: repo.id,
      url: repo.html_url,
      name: repo.name,
    })
  }
  return repos
}

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
