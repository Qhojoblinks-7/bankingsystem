
// remember to use module.exports instead of tailwind.config in production
tailwind.config = 
   {
      // Note: config only includes the used styles & variables of your selection
      content: ["./src/**/*.{html,vue,svelte,js,ts,jsx,tsx}"],
      theme: {
        extend: {
          fontFamily: {
            'label-regular-font-family': "Inter-Regular, sans-serif",
'label-medium-font-family': "Inter-Medium, sans-serif",
'body-text-medium-medium-font-family': "Inter-Medium, sans-serif",
          },
          fontSize: {
            'label-regular-font-size': "10px",
'label-medium-font-size': "10px",
'body-text-medium-medium-font-size': "14px",
          },
          fontWeight: {
            'label-regular-font-weight': "400",
'label-medium-font-weight': "500",
'body-text-medium-medium-font-weight': "500",
          },
          lineHeight: {
            'label-regular-line-height': "18px",
'label-medium-line-height': "18px",
'body-text-medium-medium-line-height': "20px", 
          },
          letterSpacing: {
             
          },
          borderRadius: {
              
          },
          colors: {
            'primary-gray-300': '#d2d5da',
'primary-gray-500': '#6d7280',
'primary-base-black': '#000000',
'supporting-green-600': '#16a34a',
            'primary-gray-300': '#d2d5da',
'primary-gray-500': '#6d7280',
'primary-base-black': '#000000',
'supporting-green-600': '#16a34a',
          },
          spacing: {
              
          },
          width: {
             
          },
          minWidth: {
             
          },
          maxWidth: {
             
          },
          height: {
             
          },
          minHeight: {
             
          },
          maxHeight: {
             
          }
        }
      }
    }

          