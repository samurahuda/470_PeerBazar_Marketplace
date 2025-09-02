<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { enhance } from '$app/forms';

    // Matches the shape returned from server actions
    export let form: { error?: string; email?: string } = {};
    let loading = false;
   </script>
    
    <div class="min-h-screen bg-slate-600 flex flex-col items-center justify-center pt-10">
        <!-- <div class="absolute top-4 left-4 text-md font-extrabold leading-tight text-white z-10">
            UNI<br/>VERSE
        </div> -->
        <a href="/" class="absolute top-4 left-4 z-10 text-sm font-extrabold leading-tight text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            UNI<br/>VERSE
        </a>

        <h1 class="text-2xl md:text-6xl font-extrabold text-white tracking-tight typewriter">
            Join the UniVerse!
        </h1>
        <Card.Root class="w-full max-w-2xl p-10 min-h-[400px] mt-[20vh]" 
        style="background-color: hsl(215 25% 72%); border: 1px solid hsl(215 25% 27%); border-radius: 20px;">
            <Card.Header>
            <Card.Title>What Are You Waiting For?</Card.Title>
            <Card.Description
            >Enter your credentials below to join the UniVerse</Card.Description
            >
            <Card.Action>
            <Button variant="link" href="/auth/login">Sign in</Button>
            </Card.Action>
            </Card.Header>
            <Card.Content>
              <form 
                method="POST" 
                action="?/register"
                use:enhance={() => {
                  loading = true;
                  return async ({ update }) => {
                    loading = false;
                    await update();
                  };
                }}
              >
                <div class="flex flex-col gap-6">
                  <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="m@g.bracu.ac.bd" 
                      value={form?.email ?? ''}
                      disabled={loading}
                      required 
                    />
                  </div>

                  <div class="grid gap-2">
                    <div class="flex items-center">
                      <Label for="password">Password</Label>
                    </div>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      disabled={loading}
                      required 
                    />
                  </div>

                  <div class="grid gap-2">
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      disabled={loading}
                      required 
                    />
                  </div>

                  {#if form?.error}
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {form.error}
                    </div>
                  {/if}
                </div>

                <Card.Footer class="flex-col gap-2 px-0 pt-6">
                  <Button 
                    type="submit" 
                    class="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </Card.Footer>
              </form>
            </Card.Content>
        </Card.Root>
    </div>


<style>
  .typewriter {
    padding-left: 5.4ch;
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid currentColor;
    width: 0;
    animation: typing 1.8s steps(24) forwards, caret 1s step-end infinite;
  }
  @keyframes typing { to { width: 24ch } }
  @keyframes caret { 50% { border-color: transparent } }
</style>



