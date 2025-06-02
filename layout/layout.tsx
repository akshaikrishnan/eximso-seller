'use client';

import { useEventListener , useUnmountEffect } from 'primereact/hooks';
import React, { useContext, useEffect, useRef , useState } from 'react';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import Link from 'next/link'; 
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppConfig from './AppConfig';
import { LayoutContext } from './context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import { ChildContainerProps, LayoutState, AppTopbarRef } from '@/types';
import { usePathname, useSearchParams } from 'next/navigation';

// Firebase imports will be dynamically loaded only on client side
const loadFirebaseMessaging = async () => {
  const { getToken, onMessage } = await import('firebase/messaging');
  const { messaging } = await import('@/app/config/constants/services/push.service');
  return { getToken, onMessage, messaging };
};

const Layout = ({ children }: ChildContainerProps) => {
  const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
  const { setRipple } = useContext(PrimeReactContext);
  const topbarRef = useRef<AppTopbarRef>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<Toast>(null);
  
  const [pushSupported, setPushSupported] = useState(false);
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axios.get('/api/user');
      return res.data;
    },
  });

  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: (event) => {
      const isOutsideClicked = !(
        sidebarRef.current?.isSameNode(event.target as Node) ||
        sidebarRef.current?.contains(event.target as Node) ||
        topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
        topbarRef.current?.menubutton?.contains(event.target as Node)
      );

      if (isOutsideClicked) {
        hideMenu();
      }
    }
  });

  const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
    type: 'click',
    listener: (event) => {
      const isOutsideClicked = !(
        topbarRef.current?.topbarmenu?.isSameNode(event.target as Node) ||
        topbarRef.current?.topbarmenu?.contains(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.isSameNode(event.target as Node) ||
        topbarRef.current?.topbarmenubutton?.contains(event.target as Node)
      );

      if (isOutsideClicked) {
        hideProfileMenu();
      }
    }
  });

  const hideMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const blockBodyScroll = (): void => {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  };

  const unblockBodyScroll = (): void => {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  };

  const showToast = (
    severity: 'info' | 'warn' | 'error' | 'success',
    summary: string,
    detail: React.ReactNode | string
  ) => {
    toastRef.current?.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  // Check for browser support and register service worker
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSupport = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setPushSupported(true);
        try {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          setServiceWorkerRegistered(true);
          console.log('Service Worker registered');
        } catch (err) {
          console.error('Service Worker registration failed:', err);
          showToast('error', 'Service Worker Error', 'Failed to register service worker');
        }
      }
    };

    checkSupport();
  }, []);

  // Setup push notifications
  useEffect(() => {
    if (typeof window === 'undefined' || !profile?._id || !pushSupported || !serviceWorkerRegistered) return;

    const setupPushNotifications = async () => {
      try {
        const { getToken, onMessage, messaging } = await loadFirebaseMessaging();
        
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Permission denied');
        }

        const registration = await navigator.serviceWorker.ready;
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        console.log('FCM Token:', token);

        await axios.post('http://localhost:5000/api/web/push/subscribe', {
          userId: profile._id,
          token,
          role: 'seller',
        });

        const unsubscribe = onMessage(messaging, (payload) => {
          const title = payload?.notification?.title || 'Notification';
          const body = payload?.notification?.body || 'You have a new notification!';
          const link = payload?.data?.link || payload?.fcmOptions?.link;

          toastRef.current?.show({
            severity: 'info',
            summary: title,
            detail: (
              <div>
                <p className="m-0">{body}</p>
                {link && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      label="View"
                      size="small"
                      className="mt-2"
                      onClick={() => window.open(link, '_blank')}
                    />
                  </div>
                )}
              </div>
            ),
            sticky: false,
            life: 5000,
          });
        });

        return () => {
          unsubscribe();
        };
      } catch (error: any) {
        console.error('Push setup failed:', error);
        const message = error?.message?.includes('Permission denied')
          ? 'Please enable notifications in your browser settings'
          : 'Failed to setup push notifications';
        showToast('error', 'Notification Error', message);
      }
    };

    const cleanupPromise = setupPushNotifications();

    return () => {
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, [profile?._id, pushSupported, serviceWorkerRegistered]);

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    layoutState.staticMenuMobileActive && blockBodyScroll();
  }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }
  }, [layoutState.profileSidebarVisible]);

  useEffect(() => {
    hideMenu();
    hideProfileMenu();
  }, [pathname, searchParams]);

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  useEffect(() => {
    setRipple?.(true);
  }, [setRipple]);

  const containerClass = classNames('layout-wrapper', {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive,
    'p-input-filled': layoutConfig.inputStyle === 'filled',
    'p-ripple-disabled': !layoutConfig.ripple
  });

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <div className={containerClass}>
        <AppTopbar ref={topbarRef} />
        <div ref={sidebarRef} className="layout-sidebar">
          <AppSidebar />
        </div>
        <div className="layout-main-container">
          {!profile?.phone && (
            <Link href="/seller/profile" passHref legacyBehavior>
              <a>
                <Message
                  severity="warn"
                  className="w-full mb-3 cursor-pointer"
                  text="Please add your phone number in your profile settings to continue adding products."
                />
              </a>
            </Link>
          )}
          <div className="layout-main">{children}</div>
          <AppFooter />
        </div>
        <AppConfig />
        <div className="layout-mask"></div>
      </div>
    </>
  );
};

export default Layout;
