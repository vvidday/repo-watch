import { Octokit } from 'https://cdn.skypack.dev/octokit?dts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.33.2'

export const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SECRET_KEY') ?? '')

const githubKey = Deno.env.get('GITHUB_KEY')
export const octokit = new Octokit({ auth: githubKey })
