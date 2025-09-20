// Configuration validation and safe access utilities
// export default ConfigManager = {
  // Default configuration fallbacks
  const defaults = {
    phoenixTheme: 'light',
    phoenixNavbarPosition: 'vertical',
    phoenixNavbarVerticalStyle: 'default',
    phoenixNavbarTopStyle: 'default',
    phoenixNavbarTopShape: 'default',
    phoenixIsRTL: false,
    phoenixSupportChat: false,
    phoenixIsNavbarVerticalCollapsed: false
  }

  // Validate if window.config exists and has required structure
  function validateConfig() {
    if (!window.config) {
      console.warn('Phoenix: window.config not found, using defaults');
      initializeConfig();
      return false;
    }

    if (!window.config.config) {
      console.warn('Phoenix: window.config.config not found, initializing');
      window.config.config = {};
    }

    if (typeof window.config.set !== 'function') {
      console.warn('Phoenix: window.config.set method not found, creating fallback');
      window.config.set = createSetFallback();
    }

    if (typeof window.config.reset !== 'function') {
      console.warn('Phoenix: window.config.reset method not found, creating fallback');
      window.config.reset = createResetFallback();
    }

    return true;
  }

  // Initialize config if it doesn't exist
  function initializeConfig() {
    window.config = {
      config: { ...defaults },
      set: createSetFallback(),
      reset: createResetFallback()
    };
  }

  // Fallback set method
  function createSetFallback() {
    return (newConfig) => {
      if (!window.config.config) {
        window.config.config = {};
      }
      Object.assign(window.config.config, newConfig);
      
      // Store in localStorage as backup
      try {
        Object.keys(newConfig).forEach(key => {
          localStorage.setItem(key, JSON.stringify(newConfig[key]));
        });
      } catch (e) {
        console.warn('Phoenix: Could not save config to localStorage', e);
      }
    };
  }

  // Fallback reset method
  function createResetFallback() {
    return () => {
      window.config.config = { ...this.defaults };
      
      // Clear localStorage
      try {
        Object.keys(this.defaults).forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.warn('Phoenix: Could not clear config from localStorage', e);
      }
    };
  }

  // Safe getter for config values
  function get(key, fallback = null) {
    if (!this.validateConfig()) {
      return fallback !== null ? fallback : this.defaults[key];
    }

    const value = window.config.config[key];
    if (value !== undefined) {
      return value;
    }

    // Try localStorage as backup
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Ignore parsing errors
    }

    return fallback !== null ? fallback : this.defaults[key];
  }

  // Safe setter for config values
  function set(key, value) {
    this.validateConfig();
    
    if (!window.config.config.hasOwnProperty(key) && !this.defaults.hasOwnProperty(key)) {
      console.warn(`Phoenix: Unknown config key "${key}"`);
    }

    const configUpdate = { [key]: value };
    window.config.set(configUpdate);
  }

  // Check if a config key exists and has expected type
  function validate(key, expectedType = null) {
    const value = this.get(key);
    
    if (value === undefined) {
      return false;
    }

    if (expectedType && typeof value !== expectedType) {
      console.warn(`Phoenix: Config "${key}" expected ${expectedType}, got ${typeof value}`);
      return false;
    }

    return true;
  }

  validateConfig();
// };

// Example of how to update the existing themeControl function
// const themeControlSafe = () => {
//   const { getData, getItemFromStore, getSystemTheme } = window.phoenix.utils;
  
//   // Ensure config is available before proceeding
//   if (!ConfigManager.validateConfig()) {
//     console.error('Phoenix: Could not initialize configuration system');
//     return;
//   }

//   const reloadPage = (target) => {
//     const pageUrl = getData(target, "page-url");
//     pageUrl ? window.location.replace(pageUrl) : window.location.reload();
//   };

//   const body = new DomNode(document.body);
//   const navbarVertical = document.querySelector(".navbar-vertical");
//   const navbarTop = document.querySelector(".navbar-top");
//   const supportChatContainer = document.querySelector(".support-chat-container");

//   initialDomSetup(body.node);

//   body.on("click", (event) => {
//     const target = new DomNode(event.target);
    
//     if (target.data("theme-control")) {
//       const controlKey = target.data("theme-control");
//       let value = event.target[event.target.type === "checkbox" ? "checked" : "value"];

//       if (controlKey === "phoenixTheme" && typeof value === "boolean") {
//         value = value ? "dark" : "light";
//       }

//       // Safe config check and update
//       if (ConfigManager.validate(controlKey)) {
//         ConfigManager.set(controlKey, value);
//       } else {
//         console.warn(`Phoenix: Invalid theme control "${controlKey}"`);
//         return;
//       }

//       // URL cleanup
//       if (new URLSearchParams(window.location.search).get("theme-control") === "true") {
//         window.history.replaceState(null, null, window.location.pathname);
//       }

//       // Handle specific control types safely
//       switch (controlKey) {
//         case "phoenixTheme": {
//           const theme = value === "auto" ? getSystemTheme() : value;
//           document.documentElement.setAttribute("data-bs-theme", theme);
          
//           const customEvent = new CustomEvent("clickControl", {
//             detail: { control: controlKey, value }
//           });
//           event.currentTarget.dispatchEvent(customEvent);
//           changeTheme(body.node);
//           break;
//         }

//         case "phoenixNavbarVerticalStyle":
//           if (navbarVertical) {
//             navbarVertical.setAttribute("data-navbar-appearance", "default");
//             if (value !== "default") {
//               navbarVertical.setAttribute("data-navbar-appearance", "darker");
//             }
//           }
//           break;

//         case "phoenixNavbarTopStyle":
//           if (navbarTop) {
//             navbarTop.setAttribute("data-navbar-appearance", "default");
//             if (value !== "default") {
//               navbarTop.setAttribute("data-navbar-appearance", "darker");
//             }
//           }
//           break;

//         case "phoenixNavbarTopShape":
//           if (ConfigManager.get("phoenixNavbarPosition") === "dual-nav") {
//             event.target.setAttribute("disabled", true);
//           } else {
//             reloadPage(target.node);
//           }
//           break;

//         case "phoenixNavbarPosition":
//           reloadPage(target.node);
//           break;

//         case "phoenixIsRTL":
//           ConfigManager.set("phoenixIsRTL", target.node.checked);
//           window.location.reload();
//           break;

//         case "phoenixSupportChat":
//           if (supportChatContainer) {
//             supportChatContainer.classList.remove("show");
//             if (value) {
//               supportChatContainer.classList.add("show");
//             }
//           }
//           break;

//         case "reset":
//           try {
//             ConfigManager.validateConfig();
//             window.config.reset();
//             window.location.reload();
//           } catch (e) {
//             console.error('Phoenix: Error resetting config', e);
//             // Fallback: clear known config keys
//             Object.keys(ConfigManager.defaults).forEach(key => {
//               try {
//                 localStorage.removeItem(key);
//               } catch (err) {
//                 // Ignore localStorage errors
//               }
//             });
//             window.location.reload();
//           }
//           break;

//         default:
//           console.warn(`Phoenix: Unhandled theme control "${controlKey}"`);
//           window.location.reload();
//       }
//     }
//   });

// //   body.on("clickControl", (({ detail: { control, value } }) => {
// //     if (control === "phoenixTheme") {
// //       handleThemeDropdownIcon(value);
// //     }
// //   }));
// };

// Usage example - replace the original themeControl call
// docReady(themeControlSafe);