<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { enhance } from '$app/forms';
    import { browser } from '$app/environment';
    export let data;
    export let form;
    
    // Initialize local state for form fields
    let initialValues = {
      nickname: data.profile?.nickname ?? '',
      alternative_email: data.profile?.alternative_email ?? '',
      mobile_phone: data.profile?.mobile_phone ?? '',
      student_id: data.profile?.student_id ?? '',
      department: data.profile?.department ?? '',
      semester: data.profile?.semester ?? ''
    };
    
    let nickname: string = initialValues.nickname;
    let alternative_email: string = initialValues.alternative_email;
    let mobile_phone: string = initialValues.mobile_phone;
    let student_id: string = initialValues.student_id;
    let department: string = initialValues.department;
    let semester: string = initialValues.semester;
    
    const normalize = (v: string) => (v ?? '').trim();
    
    let hasChanges = false;
    $: hasChanges = (
      normalize(nickname) !== normalize(initialValues.nickname) ||
      normalize(alternative_email) !== normalize(initialValues.alternative_email) ||
      normalize(mobile_phone) !== normalize(initialValues.mobile_phone) ||
      normalize(student_id) !== normalize(initialValues.student_id) ||
      normalize(department) !== normalize(initialValues.department) ||
      normalize(semester) !== normalize(initialValues.semester)
    );

    // Use loose typing to align with SvelteKit enhance runtime shape
    const handleEnhance: any = () => {
      return async ({ result, update }: any) => {
        if (result.type === 'success') {
          // lock in current values as the new baseline
          initialValues = {
            nickname: normalize(nickname),
            alternative_email: normalize(alternative_email),
            mobile_phone: normalize(mobile_phone),
            student_id: normalize(student_id),
            department: normalize(department),
            semester: normalize(semester)
          };
        }
        await update();
      };
    };

    // Persist selected tab in URL so it survives refresh and form submits
    let currentTab: string = 'account';
    if (browser) {
      const t = new URL(window.location.href).searchParams.get('tab');
      if (t) currentTab = t;
    }
    $: if (browser) {
      const url = new URL(window.location.href);
      if (url.searchParams.get('tab') !== currentTab) {
        url.searchParams.set('tab', currentTab);
        history.replaceState({}, '', url);
      }
    }
   </script>
    
   <div
    class="min-h-[100dvh] flex items-center justify-center px-4"
   >
    <div
     class="w-full max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto p-4 sm:p-8"
    >
     <Tabs.Root
      bind:value={currentTab}
      class="w-full"
     >
      <Tabs.List
       class="flex flex-wrap gap-2 justify-center sm:justify-start"
      >
       <Tabs.Trigger value="account" class="px-4 py-2">Account</Tabs.Trigger>
       <Tabs.Trigger value="password" class="px-4 py-2">Password</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
       <form method="POST" action="?/updateProfile" use:enhance={handleEnhance}>
       <Card.Root class="w-full">
        <Card.Header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
         <Card.Title class="text-2xl">Account</Card.Title>
         <Card.Description>
          Update your profile information.
         </Card.Description>
        </Card.Header>
          {#if form?.error}
            <p class="text-sm text-[hsl(0_84%_60%)]">{form.error}</p>
          {:else if form?.success}
            <p class="text-sm text-[hsl(142_76%_36%)]">{form.message ?? 'Saved successfully.'}</p>
          {/if}
        <Card.Content class="grid gap-6 sm:grid-cols-2">
         <div class="grid gap-2">
          <Label for="display_name" class="text-base">Display name</Label>
           <Input id="display_name" value={data.display_name} class="h-12 text-lg" readonly disabled />
         </div>
         <div class="grid gap-2">
          <Label for="nickname" class="text-base">Nickname</Label>
           <Input id="nickname" name="nickname" bind:value={nickname} placeholder="e.g., Jane" class="h-12 text-lg" />
         </div>

         <div class="grid gap-2 sm:col-span-2">
          <Label for="email" class="text-base">BRACU Email</Label>
           <Input id="email" type="email" value={data.email} class="h-12 text-lg" readonly disabled />
         </div>

         <div class="grid gap-2 sm:col-span-2">
          <Label for="alternative_email" class="text-base">Alternative email</Label>
           <Input id="alternative_email" name="alternative_email" type="email" bind:value={alternative_email} placeholder="name@example.com" class="h-12 text-lg" />
         </div>

         <div class="grid gap-2">
          <Label for="mobile_phone" class="text-base">Mobile phone</Label>
           <Input id="mobile_phone" name="mobile_phone" type="tel" bind:value={mobile_phone} placeholder="+8801XXXXXXXXX" class="h-12 text-lg" />
         </div>
         <div class="grid gap-2">
          <Label for="student_id" class="text-base">Student ID</Label>
           <Input id="student_id" name="student_id" inputmode="numeric" bind:value={student_id} placeholder="8-digit ID" class="h-12 text-lg" />
         </div>

         <div class="grid gap-2">
          <Label for="department" class="text-base">Department</Label>
           <Input id="department" name="department" bind:value={department} placeholder="e.g., CSE" class="h-12 text-lg" />
         </div>
         <div class="grid gap-2">
          <Label for="semester" class="text-base">Semester</Label>
           <Input id="semester" name="semester" bind:value={semester} placeholder="e.g., Fall 2025" class="h-12 text-lg" />
         </div>

         
        </Card.Content>
          <Card.Footer class="flex flex-col sm:flex-row gap-3 sm:justify-end">
           <Button type="submit" class="h-12 px-6 text-base w-full sm:w-auto" disabled={!hasChanges} aria-disabled={!hasChanges}>
            Save changes
           </Button>
        </Card.Footer>
        </Card.Root>
       </form>
      </Tabs.Content>
     <Tabs.Content value="password">
      <form method="POST" action="?/changePassword">
      <Card.Root class="w-full">
       <Card.Header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Card.Title>Password</Card.Title>
        <Card.Description>
         Change your password here. After saving, you&apos;ll be logged out.
        </Card.Description>
       </Card.Header>
       <Card.Content class="grid gap-6 sm:grid-cols-2">
        <div class="grid gap-3 order-1">
         <Label for="tabs-demo-current">Current password</Label>
          <Input id="tabs-demo-current" name="current_password" type="password" />
        </div>
        <div class="grid gap-3 order-2">
         <Label for="tabs-demo-new">New password</Label>
          <Input id="tabs-demo-new" name="new_password" type="password" />
        </div>
       </Card.Content>
         <Card.Footer class="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button type="submit" class="w-full sm:w-auto">Save password</Button>
       </Card.Footer>
       </Card.Root>
      </form>
     </Tabs.Content>
     </Tabs.Root>
    </div>
   </div>