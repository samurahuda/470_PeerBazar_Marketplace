<!-- intentionally left empty for now
<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import HouseIcon from "@lucide/svelte/icons/house";
    import UserIcon from "@lucide/svelte/icons/user";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import BellIcon from "@lucide/svelte/icons/bell";
    import { DropdownMenu } from "$lib/components/ui/dropdown-menu/index.js";
    import ChevronUp from "@lucide/svelte/icons/chevron-up";


    const items = [
      { title: "Home", href: "/myspace", icon: HouseIcon },
      { title: "Edit Profile", href: "/myspace/profile", icon: UserIcon },
      { title: "Settings", href: "/myspace/settings", icon: SettingsIcon },
      { title: "Notifications", href: "/myspace/notifications", icon: BellIcon },
      // { title: "Admin Dashboard", href: "/myspace/admin", icon: SettingsIcon }, // later
    ];
  </script>
  
  <Sidebar.Root>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>MySpace</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each items as item (item.href)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href={item.href} {...props}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>
 -->


 <script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import HouseIcon from "@lucide/svelte/icons/house";
    import UserIcon from "@lucide/svelte/icons/user";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import BellIcon from "@lucide/svelte/icons/bell";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import ChevronUp from "@lucide/svelte/icons/chevron-up";
  
    const items = [
      { title: "Home", href: "/myspace", icon: HouseIcon },
      { title: "Edit Profile", href: "/myspace/profile", icon: UserIcon },
      { title: "Settings", href: "/myspace/settings", icon: SettingsIcon },
      { title: "Notifications", href: "/myspace/notifications", icon: BellIcon },
    ];
  </script>
  
  <Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>MySpace</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {#each items as item (item.href)}
              <Sidebar.MenuItem>
                <Sidebar.MenuButton>
                  {#snippet child({ props })}
                    <a href={item.href} {...props}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  {/snippet}
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            {/each}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {#snippet child({ props })}
                <Sidebar.MenuButton
                  {...props}
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  Username
                  <ChevronUp class="ml-auto" />
                </Sidebar.MenuButton>
              {/snippet}
            </DropdownMenu.Trigger>
  
            <DropdownMenu.Content side="top" class="w-(--bits-dropdown-menu-anchor-width)">
              <DropdownMenu.Item><a href="/myspace/profile">Account</a></DropdownMenu.Item>
              <DropdownMenu.Item><a href="/myspace/settings">Billing</a></DropdownMenu.Item>
              <DropdownMenu.Item>Sign out</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  </Sidebar.Root>