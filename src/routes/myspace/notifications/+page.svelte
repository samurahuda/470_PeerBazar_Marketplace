<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  let notifications = data.notifications || [];
  let loading = false;
  let errorMessage = '';
  let successMessage = '';

  let giveawayNotifications = [];
  let otherNotifications = [];

  $: {
    giveawayNotifications = notifications.filter(n => n.type === 'general' && n.title?.includes('Giveaway Claimed!'));
    otherNotifications = notifications.filter(n => !(n.type === 'general' && n.title?.includes('Giveaway Claimed!')));
  }

  async function markAsRead(notificationId: string) {
    loading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const formData = new FormData();
      formData.append('notificationId', notificationId);

      const response = await fetch('?/markAsRead', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      console.log('Mark as read - response:', result);
      console.log('Mark as read - response type:', typeof result);
      console.log('Mark as read - response.data:', result.data);
      console.log('Mark as read - response.data type:', typeof result.data);
      
      if (result.type === 'success' && result.data) {
        let actionResult;
        try {
          actionResult = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        } catch (parseError) {
          console.error('Mark as read - parse error:', parseError);
          actionResult = result.data;
        }
        console.log('Mark as read - parsed action result:', actionResult);
        
        // Handle the array response format from SvelteKit
        let success = false;
        let error = null;
        
        if (Array.isArray(actionResult)) {
          // The first element contains the success data
          const firstElement = actionResult[0];
          if (firstElement && typeof firstElement === 'object' && 'success' in firstElement) {
            success = firstElement.success === true || firstElement.success === 1;
            error = firstElement.error;
          } else if (actionResult[1] === true) {
            // Second element is true, indicating success
            success = true;
          }
        } else if (actionResult && typeof actionResult === 'object' && 'success' in actionResult) {
          success = actionResult.success === true || actionResult.success === 1;
          error = actionResult.error;
        }
        
        if (success) {
          successMessage = 'Notification marked as read';
          // Update the notification in the list
          notifications = notifications.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true }
              : notification
          );
          console.log('Mark as read - updated notifications:', notifications);
        } else {
          errorMessage = error || 'Failed to mark notification as read';
          console.error('Mark as read - action failed:', error);
        }
      } else {
        errorMessage = 'Failed to mark notification as read';
        console.error('Mark as read - unexpected response format:', result);
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }

  async function markAllAsRead() {
    loading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const response = await fetch('?/markAllAsRead', {
        method: 'POST'
      });

      const result = await response.json();

      if (result.type === 'success' && result.data) {
        let actionResult;
        try {
          actionResult = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        } catch (parseError) {
          console.error('Mark all as read - parse error:', parseError);
          actionResult = result.data;
        }
        
        // Handle the array response format from SvelteKit
        let success = false;
        let error = null;
        
        if (Array.isArray(actionResult)) {
          // The first element contains the success data
          const firstElement = actionResult[0];
          if (firstElement && typeof firstElement === 'object' && 'success' in firstElement) {
            success = firstElement.success === true || firstElement.success === 1;
            error = firstElement.error;
          } else if (actionResult[1] === true) {
            // Second element is true, indicating success
            success = true;
          }
        } else if (actionResult && typeof actionResult === 'object' && 'success' in actionResult) {
          success = actionResult.success === true || actionResult.success === 1;
          error = actionResult.error;
        }
        
        if (success) {
          successMessage = 'All notifications marked as read';
          // Update all notifications in the list
          notifications = notifications.map(notification => ({ ...notification, is_read: true }));
        } else {
          errorMessage = error || 'Failed to mark all notifications as read';
        }
      } else {
        errorMessage = 'Failed to mark all notifications as read';
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }

  async function deleteNotification(notificationId: string) {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    loading = true;
    errorMessage = '';
    successMessage = '';

    try {
      const formData = new FormData();
      formData.append('notificationId', notificationId);

      const response = await fetch('?/deleteNotification', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.type === 'success' && result.data) {
        let actionResult;
        try {
          actionResult = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        } catch (parseError) {
          console.error('Delete notification - parse error:', parseError);
          actionResult = result.data;
        }
        
        // Handle the array response format from SvelteKit
        let success = false;
        let error = null;
        
        if (Array.isArray(actionResult)) {
          // The first element contains the success data
          const firstElement = actionResult[0];
          if (firstElement && typeof firstElement === 'object' && 'success' in firstElement) {
            success = firstElement.success === true || firstElement.success === 1;
            error = firstElement.error;
          } else if (actionResult[1] === true) {
            // Second element is true, indicating success
            success = true;
          }
        } else if (actionResult && typeof actionResult === 'object' && 'success' in actionResult) {
          success = actionResult.success === true || actionResult.success === 1;
          error = actionResult.error;
        }
        
        if (success) {
          successMessage = 'Notification deleted';
          // Remove the notification from the list
          notifications = notifications.filter(notification => notification.id !== notificationId);
        } else {
          errorMessage = error || 'Failed to delete notification';
        }
      } else {
        errorMessage = 'Failed to delete notification';
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'An error occurred';
    } finally {
      loading = false;
    }
  }

  function getTypeIcon(type: string, title: string): string {
    switch (type) {
      case 'event': return '📅';
      case 'study_room': return '📚';
      case 'transaction': return '💰';
      case 'food_order': return '🍕';
      case 'banner_request': return '📢';
      case 'general':
        if (title.includes('Giveaway Claimed!')) return '🎁';
        return '📌';
      default: return '📌';
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;
</script>

<div class="w-full min-h-[100dvh] pt-16 bg-[hsl(222.2_47.4%_11.2%)] text-white">
  <!-- Universe Link -->
  <a href="/" class="absolute top-4 left-4 z-10 text-sm font-extrabold leading-tight text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
    UNI<br/>VERSE
  </a>
  
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-semibold">Notifications</h1>
      {#if unreadCount > 0}
        <button
          on:click={markAllAsRead}
          disabled={loading}
          class="px-4 py-2 text-sm font-medium text-white border border-white/20 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Marking...' : `Mark All as Read (${unreadCount})`}
        </button>
      {/if}
    </div>

    <!-- Messages -->
    {#if errorMessage}
      <div class="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
        {errorMessage}
      </div>
    {/if}
    
    {#if successMessage}
      <div class="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
        {successMessage}
      </div>
    {/if}

    {#if data.error}
      <div class="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
        {data.error}
      </div>
    {/if}
    
    <!-- Notifications Table -->
    <!-- General Notifications Table -->
    {#if otherNotifications.length > 0}
      <Card.Root>
        <Card.Content class="p-0">
          <Table.Root>
            <Table.Header>
              <Table.Row class="border-[hsl(214.3_31.8%_91.4%)]/20">
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Type</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Title</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Message</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Date</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Status</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each otherNotifications as notification (notification.id)}
                <Table.Row class="border-[hsl(214.3_31.8%_91.4%)]/20 hover:bg-[hsl(214.3_31.8%_91.4%)]/5">
                  <Table.Cell class="text-2xl">
                    {getTypeIcon(notification.type, notification.title)}
                  </Table.Cell>
                  <Table.Cell class="font-medium text-[hsl(222.2_47.4%_11.2%)]">
                    {notification.title}
                  </Table.Cell>
                  <Table.Cell class="text-[hsl(222.2_47.4%_11.2%)] max-w-xs">
                    <button 
                      class="truncate cursor-pointer hover:text-blue-300 transition-colors text-left w-full bg-transparent border-none p-0"
                      title={notification.message}
                      on:click={() => {
                        if (notification.message.length > 50) {
                          alert(notification.message);
                        }
                      }}
                      on:keydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (notification.message.length > 50) {
                            alert(notification.message);
                          }
                        }
                      }}
                    >
                      {notification.message}
                    </button>
                  </Table.Cell>
                  <Table.Cell class="text-[hsl(222.2_47.4%_11.2%)] text-sm">
                    {formatDate(notification.created_at)}
                  </Table.Cell>
                  <Table.Cell>
                    {#if notification.is_read}
                      <span class="px-2 py-1 text-xs rounded-full bg-green-500/20 text-[hsl(222.2_47.4%_11.2%)] font-medium">
                        Read
                      </span>
                    {:else}
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-[hsl(222.2_47.4%_11.2%)] font-medium">
                        Unread
                      </span>
                    {/if}
                  </Table.Cell>
                  <Table.Cell>
                    <div class="flex gap-2">
                      {#if !notification.is_read}
                        <button
                          on:click={() => markAsRead(notification.id)}
                          disabled={loading}
                          class="px-2 py-1 text-xs font-medium text-[hsl(222.2_47.4%_11.2%)] border border-[hsl(222.2_47.4%_11.2%)]/20 rounded hover:bg-[hsl(222.2_47.4%_11.2%)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Read
                        </button>
                      {/if}
                      <button
                        on:click={() => deleteNotification(notification.id)}
                        disabled={loading}
                        class="px-2 py-1 text-xs font-medium text-[hsl(222.2_47.4%_11.2%)] border border-red-500/20 rounded hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </Card.Content>
      </Card.Root>
    {:else if giveawayNotifications.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-semibold mb-4">No Notifications</h2>
        <p class="text-[hsl(215.4_16.3%_46.9%)]">You're all caught up! Check back later for new notifications.</p>
      </div>
    {/if}

    <!-- Giveaway Notifications Table -->
    {#if giveawayNotifications.length > 0}
      <h2 class="text-2xl font-semibold mt-8 mb-4">Giveaway Notifications</h2>
      <Card.Root>
        <Card.Content class="p-0">
          <Table.Root>
            <Table.Header>
              <Table.Row class="border-[hsl(214.3_31.8%_91.4%)]/20">
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Type</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Title</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Message</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Claimer Phone</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Date</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Status</Table.Head>
                <Table.Head class="text-[hsl(222.2_47.4%_11.2%)] font-medium">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each giveawayNotifications as notification (notification.id)}
                <Table.Row class="border-[hsl(214.3_31.8%_91.4%)]/20 hover:bg-[hsl(214.3_31.8%_91.4%)]/5">
                  <Table.Cell class="text-2xl">
                    {getTypeIcon(notification.type, notification.title)}
                  </Table.Cell>
                  <Table.Cell class="font-medium text-[hsl(222.2_47.4%_11.2%)]">
                    {notification.title}
                  </Table.Cell>
                  <Table.Cell class="text-[hsl(222.2_47.4%_11.2%)] max-w-xs">
                    <button 
                      class="truncate cursor-pointer hover:text-blue-300 transition-colors text-left w-full bg-transparent border-none p-0"
                      title={notification.message}
                      on:click={() => {
                        if (notification.message.length > 50) {
                          alert(notification.message);
                        }
                      }}
                      on:keydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (notification.message.length > 50) {
                            alert(notification.message);
                          }
                        }
                      }}
                    >
                      {notification.message}
                    </button>
                  </Table.Cell>
                  <Table.Cell class="text-[hsl(222.2_47.4%_11.2%)] text-sm">
                    {notification.claimer_phone_number || 'N/A'}
                  </Table.Cell>
                  <Table.Cell class="text-[hsl(222.2_47.4%_11.2%)] text-sm">
                    {formatDate(notification.created_at)}
                  </Table.Cell>
                  <Table.Cell>
                    {#if notification.is_read}
                      <span class="px-2 py-1 text-xs rounded-full bg-green-500/20 text-[hsl(222.2_47.4%_11.2%)] font-medium">
                        Read
                      </span>
                    {:else}
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-[hsl(222.2_47.4%_11.2%)] font-medium">
                        Unread
                      </span>
                    {/if}
                  </Table.Cell>
                  <Table.Cell>
                    <div class="flex gap-2">
                      {#if !notification.is_read}
                        <button
                          on:click={() => markAsRead(notification.id)}
                          disabled={loading}
                          class="px-2 py-1 text-xs font-medium text-[hsl(222.2_47.4%_11.2%)] border border-[hsl(222.2_47.4%_11.2%)]/20 rounded hover:bg-[hsl(222.2_47.4%_11.2%)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark Read
                        </button>
                      {/if}
                      <button
                        on:click={() => deleteNotification(notification.id)}
                        disabled={loading}
                        class="px-2 py-1 text-xs font-medium text-[hsl(222.2_47.4%_11.2%)] border border-red-500/20 rounded hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </Card.Content>
      </Card.Root>
    {:else if otherNotifications.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📭</div>
        <h2 class="text-2xl font-semibold mb-4">No Giveaway Notifications</h2>
        <p class="text-[hsl(215.4_16.3%_46.9%)]">No one has claimed your giveaways yet. Check back later!</p>
      </div>
    {/if}
  </div>
</div>


