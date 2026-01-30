
const sprite = `<svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
<defs>
<symbol id="icon-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M21.7304 18L13.7304 3.99998C13.556 3.69218 13.303 3.43617 12.9973 3.25805C12.6917 3.07993 12.3442 2.98608 11.9904 2.98608C11.6366 2.98608 11.2892 3.07993 10.9835 3.25805C10.6778 3.43617 10.4249 3.69218 10.2504 3.99998L2.25042 18C2.0741 18.3053 1.98165 18.6519 1.98243 19.0045C1.98321 19.3571 2.0772 19.7032 2.25486 20.0078C2.43253 20.3124 2.68757 20.5646 2.99411 20.7388C3.30066 20.9131 3.64783 21.0032 4.00042 21H20.0004C20.3513 20.9996 20.6959 20.9069 20.9997 20.7313C21.3035 20.5556 21.5556 20.3031 21.7309 19.9991C21.9062 19.6951 21.9985 19.3504 21.9984 18.9995C21.9983 18.6486 21.9059 18.3039 21.7304 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 9V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 17H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-bulp" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M15 14C15.2 13 15.7 12.3 16.5 11.5C17.5 10.6 18 9.3 18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 9 6.2 10.2 7.5 11.5C8.2 12.2 8.8 13 9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 18H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 22H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-delete" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M10 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 11V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 2C9.43223 4.69615 8 8.27674 8 12C8 15.7233 9.43223 19.3038 12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2 12H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-mails" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M17 18.9999C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7892 15.5304 20.9999 15 20.9999H4C3.46957 20.9999 2.96086 20.7892 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 18.9999V10.9999C2.00001 10.6489 2.09243 10.304 2.26796 9.99997C2.4435 9.69594 2.69597 9.44348 3 9.26794" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 5.5L15.581 9.679C15.2585 9.88617 14.8833 9.99631 14.5 9.99631C14.1167 9.99631 13.7415 9.88617 13.419 9.679L7 5.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 3H9C7.89543 3 7 3.89543 7 5V13C7 14.1046 7.89543 15 9 15H20C21.1046 15 22 14.1046 22 13V5C22 3.89543 21.1046 3 20 3Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-recipe" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M13 16H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14 8H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 12H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 3.00004C4 2.73482 4.10536 2.48047 4.29289 2.29293C4.48043 2.1054 4.73478 2.00004 5 2.00004C5.24762 1.99868 5.49048 2.06806 5.7 2.20004L6.633 2.80004C6.84204 2.93361 7.08493 3.00459 7.333 3.00459C7.58107 3.00459 7.82396 2.93361 8.033 2.80004L8.967 2.20004C9.17604 2.06646 9.41893 1.99548 9.667 1.99548C9.91507 1.99548 10.158 2.06646 10.367 2.20004L11.3 2.80004C11.509 2.93361 11.7519 3.00459 12 3.00459C12.2481 3.00459 12.491 2.93361 12.7 2.80004L13.633 2.20004C13.842 2.06646 14.0849 1.99548 14.333 1.99548C14.5811 1.99548 14.824 2.06646 15.033 2.20004L15.967 2.80004C16.176 2.93361 16.4189 3.00459 16.667 3.00459C16.9151 3.00459 17.158 2.93361 17.367 2.80004L18.3 2.20004C18.5095 2.06806 18.7524 1.99868 19 2.00004C19.2652 2.00004 19.5196 2.1054 19.7071 2.29293C19.8946 2.48047 20 2.73482 20 3.00004V21C20 21.2653 19.8946 21.5196 19.7071 21.7071C19.5196 21.8947 19.2652 22 19 22C18.7524 22.0014 18.5095 21.932 18.3 21.8L17.367 21.2C17.158 21.0665 16.9151 20.9955 16.667 20.9955C16.4189 20.9955 16.176 21.0665 15.967 21.2L15.033 21.8C14.824 21.9336 14.5811 22.0046 14.333 22.0046C14.0849 22.0046 13.842 21.9336 13.633 21.8L12.7 21.2C12.491 21.0665 12.2481 20.9955 12 20.9955C11.7519 20.9955 11.509 21.0665 11.3 21.2L10.367 21.8C10.158 21.9336 9.91507 22.0046 9.667 22.0046C9.41893 22.0046 9.17604 21.9336 8.967 21.8L8.033 21.2C7.82396 21.0665 7.58107 20.9955 7.333 20.9955C7.08493 20.9955 6.84204 21.0665 6.633 21.2L5.7 21.8C5.49048 21.932 5.24762 22.0014 5 22C4.73478 22 4.48043 21.8947 4.29289 21.7071C4.10536 21.5196 4 21.2653 4 21V3.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-stop" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M4.92871 4.92896L19.0697 19.071" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-anvil" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M7 10H6C4.93913 10 3.92172 9.57857 3.17157 8.82843C2.42143 8.07828 2 7.06087 2 6C2 5.73478 2.10536 5.48043 2.29289 5.29289C2.48043 5.10536 2.73478 5 3 5H7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 5C7 4.73478 7.10536 4.48043 7.29289 4.29289C7.48043 4.10536 7.73478 4 8 4H21C21.2652 4 21.5196 4.10536 21.7071 4.29289C21.8946 4.48043 22 4.73478 22 5C22 6.85652 21.2625 8.63699 19.9497 9.94975C18.637 11.2625 16.8565 12 15 12H8C7.73478 12 7.48043 11.8946 7.29289 11.7071C7.10536 11.5196 7 11.2652 7 11V5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 12V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 12V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 20C5 19.2044 5.31607 18.4413 5.87868 17.8787C6.44129 17.3161 7.20435 17 8 17H16C16.7956 17 17.5587 17.3161 18.1213 17.8787C18.6839 18.4413 19 19.2044 19 20C19 20.2652 18.8946 20.5196 18.7071 20.7071C18.5196 20.8946 18.2652 21 18 21H6C5.73478 21 5.48043 20.8946 5.29289 20.7071C5.10536 20.5196 5 20.2652 5 20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-arrow-down" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-arrow-up-down" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M11.9996 5.25L8.30957 9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 5.25L15.69 9.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.9996 18.75L8.30957 14.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18.75L15.69 14.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-banknote-x" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M13 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 17L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18 12H18.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 17L17 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 12H6.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-blocks-integration" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M10 22V7C10 6.73478 9.89464 6.48043 9.70711 6.29289C9.51957 6.10536 9.26522 6 9 6H4C3.46957 6 2.96086 6.21071 2.58579 6.58579C2.21071 6.96086 2 7.46957 2 8V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H16C16.5304 22 17.0391 21.7893 17.4142 21.4142C17.7893 21.0391 18 20.5304 18 20V15C18 14.7348 17.8946 14.4804 17.7071 14.2929C17.5196 14.1054 17.2652 14 17 14H2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M21 2H15C14.4477 2 14 2.44772 14 3V9C14 9.55228 14.4477 10 15 10H21C21.5523 10 22 9.55228 22 9V3C22 2.44772 21.5523 2 21 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-buoy" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M16.7116 4.33001C17.3114 4.69941 17.8658 5.13772 18.3636 5.63602C18.8736 6.14602 19.3076 6.70002 19.6696 7.28802M16.7116 4.33001L13.2636 8.46802M16.7116 4.33001C15.2937 3.46056 13.6629 3.00037 11.9996 3.00037C10.3364 3.00037 8.70556 3.46056 7.28765 4.33001M19.6696 7.28802L15.5316 10.736M19.6696 7.28802C20.5391 8.70593 20.9993 10.3368 20.9993 12C20.9993 13.6633 20.5391 15.2941 19.6696 16.712M13.2636 8.46802C13.7859 8.65472 14.26 8.95532 14.6516 9.34801C15.0444 9.73963 15.345 10.2138 15.5316 10.736M13.2636 8.46802C12.4462 8.17666 11.5531 8.17666 10.7356 8.46802M7.28765 4.33001L10.7356 8.46802M7.28765 4.33001C6.6879 4.69938 6.13346 5.1377 5.63565 5.63602C5.13734 6.13383 4.69902 6.68827 4.32965 7.28802M15.5316 10.736C15.823 11.5535 15.823 12.4465 15.5316 13.264M19.6696 16.712L15.5316 13.264M19.6696 16.712C19.3003 17.3117 18.8619 17.8662 18.3636 18.364C17.8536 18.874 17.2996 19.308 16.7116 19.67M15.5316 13.264C15.3506 13.77 15.0566 14.246 14.6516 14.652C14.26 15.0447 13.7859 15.3453 13.2636 15.532M10.7356 8.46802C10.2134 8.65469 9.73926 8.95529 9.34765 9.34801C8.94265 9.75401 8.64865 10.23 8.46765 10.736M13.2636 15.532L16.7116 19.67M13.2636 15.532C12.4462 15.8234 11.5531 15.8234 10.7356 15.532M16.7116 19.67C15.2937 20.5395 13.6629 20.9997 11.9996 20.9997C10.3364 20.9997 8.70556 20.5395 7.28765 19.67M7.28765 19.67L10.7356 15.532M7.28765 19.67C6.6879 19.3006 6.13346 18.8623 5.63565 18.364C5.13735 17.8662 4.69904 17.3117 4.32965 16.712M10.7356 15.532C10.2134 15.3453 9.73926 15.0447 9.34765 14.652C8.95495 14.2604 8.65435 13.7862 8.46765 13.264M8.46765 13.264L4.32965 16.712M8.46765 13.264C8.17629 12.4465 8.17629 11.5535 8.46765 10.736M4.32965 16.712C3.46019 15.2941 3 13.6633 3 12C3 10.3368 3.46019 8.70593 4.32965 7.28802M4.32965 7.28802L8.46765 10.736" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-calender-days-date" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 14H8.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 14H16.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 18H8.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18H12.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 18H16.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-chart" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M3 3V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 16C7.5 14 8.5 9 11 9C13 9 13 12 15 12C17.5 12 19.5 7 20 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M22 17C22 17.5304 21.7893 18.0391 21.4142 18.4142C21.0391 18.7893 20.5304 19 20 19H6.828C6.29761 19.0001 5.78899 19.2109 5.414 19.586L3.212 21.788C3.1127 21.8873 2.9862 21.9549 2.84849 21.9823C2.71077 22.0097 2.56803 21.9956 2.43831 21.9419C2.30858 21.8881 2.1977 21.7971 2.11969 21.6804C2.04167 21.5637 2.00002 21.4264 2 21.286V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H20C20.5304 3 21.0391 3.21071 21.4142 3.58579C21.7893 3.96086 22 4.46957 22 5V17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 11H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 15H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7 7H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-doulbe-check" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M18 6L7 17L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 10L14.5 17.5L13 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M10.7334 5.07599C13.0628 4.7984 15.419 5.29081 17.4423 6.47804C19.4655 7.66527 21.0446 9.48207 21.9384 11.651C22.0217 11.8755 22.0217 12.1225 21.9384 12.347C21.5709 13.238 21.0852 14.0755 20.4944 14.837" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.0841 14.158C13.5183 14.7045 12.7605 15.0069 11.9739 15C11.1873 14.9932 10.4349 14.6777 9.87868 14.1215C9.32245 13.5652 9.00695 12.8128 9.00011 12.0262C8.99328 11.2396 9.29566 10.4818 9.84214 9.91602" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.4785 17.499C16.152 18.2848 14.672 18.7761 13.1389 18.9394C11.6058 19.1028 10.0555 18.9345 8.59316 18.4459C7.13084 17.9573 5.79072 17.1599 4.66374 16.1078C3.53676 15.0556 2.64928 13.7734 2.06153 12.348C1.97819 12.1235 1.97819 11.8765 2.06153 11.652C2.94816 9.50189 4.5082 7.69728 6.50753 6.50903" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2 2L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-funnel" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M9.99964 20C9.99955 20.1858 10.0512 20.368 10.1489 20.5261C10.2466 20.6842 10.3864 20.8119 10.5526 20.895L12.5526 21.895C12.7051 21.9712 12.8746 22.0072 13.0449 21.9994C13.2152 21.9917 13.3807 21.9406 13.5257 21.8509C13.6707 21.7613 13.7903 21.636 13.8733 21.4871C13.9562 21.3381 13.9997 21.1705 13.9996 21V14C13.9999 13.5044 14.1841 13.0265 14.5166 12.659L21.7396 4.67C21.8691 4.52656 21.9542 4.34868 21.9847 4.15788C22.0152 3.96708 21.9898 3.77153 21.9115 3.59487C21.8333 3.41822 21.7055 3.26802 21.5436 3.16245C21.3818 3.05688 21.1929 3.00046 20.9996 3H2.99964C2.80625 3.00007 2.61702 3.05622 2.45489 3.16164C2.29276 3.26706 2.16467 3.41723 2.08614 3.59396C2.00762 3.7707 1.98203 3.96641 2.01246 4.15739C2.0429 4.34837 2.12807 4.52643 2.25764 4.67L9.48264 12.659C9.81518 13.0265 9.99942 13.5044 9.99964 14V20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M9.6713 4.13603C9.7264 3.55637 9.99564 3.01807 10.4264 2.62631C10.8572 2.23454 11.4185 2.01746 12.0008 2.01746C12.5831 2.01746 13.1444 2.23454 13.5752 2.62631C14.006 3.01807 14.2752 3.55637 14.3303 4.13603C14.3634 4.51048 14.4863 4.87145 14.6884 5.18837C14.8906 5.50529 15.1662 5.76884 15.4918 5.95671C15.8174 6.14457 16.1834 6.25123 16.559 6.26765C16.9346 6.28407 17.3085 6.20977 17.6493 6.05103C18.1784 5.81081 18.778 5.77605 19.3313 5.95352C19.8846 6.13098 20.3521 6.50798 20.6428 7.01113C20.9335 7.51429 21.0266 8.1076 20.9039 8.6756C20.7813 9.2436 20.4517 9.74565 19.9793 10.084C19.6717 10.2999 19.4206 10.5866 19.2472 10.9201C19.0739 11.2535 18.9833 11.6237 18.9833 11.9995C18.9833 12.3753 19.0739 12.7456 19.2472 13.079C19.4206 13.4124 19.6717 13.6992 19.9793 13.915C20.4517 14.2534 20.7813 14.7555 20.9039 15.3235C21.0266 15.8915 20.9335 16.4848 20.6428 16.9879C20.3521 17.4911 19.8846 17.8681 19.3313 18.0455C18.778 18.223 18.1784 18.1883 17.6493 17.948C17.3085 17.7893 16.9346 17.715 16.559 17.7314C16.1834 17.7478 15.8174 17.8545 15.4918 18.0424C15.1662 18.2302 14.8906 18.4938 14.6884 18.8107C14.4863 19.1276 14.3634 19.4886 14.3303 19.863C14.2752 20.4427 14.006 20.981 13.5752 21.3727C13.1444 21.7645 12.5831 21.9816 12.0008 21.9816C11.4185 21.9816 10.8572 21.7645 10.4264 21.3727C9.99564 20.981 9.7264 20.4427 9.6713 19.863C9.63825 19.4884 9.5154 19.1273 9.31317 18.8103C9.11094 18.4933 8.83528 18.2296 8.50954 18.0418C8.1838 17.8539 7.81757 17.7472 7.44188 17.7309C7.06619 17.7146 6.69211 17.7891 6.3513 17.948C5.82219 18.1883 5.22263 18.223 4.6693 18.0455C4.11598 17.8681 3.64848 17.4911 3.35779 16.9879C3.0671 16.4848 2.97402 15.8915 3.09666 15.3235C3.21931 14.7555 3.54891 14.2534 4.0213 13.915C4.32892 13.6992 4.58003 13.4124 4.75339 13.079C4.92675 12.7456 5.01726 12.3753 5.01726 11.9995C5.01726 11.6237 4.92675 11.2535 4.75339 10.9201C4.58003 10.5866 4.32892 10.2999 4.0213 10.084C3.54957 9.74547 3.22055 9.24362 3.09821 8.67601C2.97586 8.1084 3.06891 7.51557 3.35929 7.01274C3.64966 6.50991 4.11662 6.13301 4.66939 5.95527C5.22217 5.77753 5.82129 5.81166 6.3503 6.05103C6.69106 6.20977 7.06505 6.28407 7.44061 6.26765C7.81616 6.25123 8.18224 6.14457 8.50784 5.95671C8.83345 5.76884 9.109 5.50529 9.31117 5.18837C9.51334 4.87145 9.63619 4.51048 9.6693 4.13603" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-list" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M13 5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13 19H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3 17L5 19L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 4H4C3.44772 4 3 4.44772 3 5V9C3 9.55228 3.44772 10 4 10H8C8.55228 10 9 9.55228 9 9V5C9 4.44772 8.55228 4 8 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-luggage" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M6 20C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V8C4 7.46957 4.21071 6.96086 4.58579 6.58579C4.96086 6.21071 5.46957 6 6 6H18C18.5304 6 19.0391 6.21071 19.4142 6.58579C19.7893 6.96086 20 7.46957 20 8V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 18V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 20H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-messages-square" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M16 10C16 10.5304 15.7893 11.0391 15.4142 11.4142C15.0391 11.7893 14.5304 12 14 12H6.828C6.29761 12.0001 5.78899 12.2109 5.414 12.586L3.212 14.788C3.1127 14.8873 2.9862 14.9549 2.84849 14.9823C2.71077 15.0097 2.56803 14.9956 2.43831 14.9419C2.30858 14.8881 2.1977 14.7971 2.11969 14.6804C2.04167 14.5637 2.00002 14.4264 2 14.286V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M20 9C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V21.286C22 21.4264 21.9583 21.5637 21.8803 21.6804C21.8023 21.7971 21.6914 21.8881 21.5617 21.9419C21.432 21.9956 21.2892 22.0097 21.1515 21.9823C21.0138 21.9549 20.8873 21.8873 20.788 21.788L18.586 19.586C18.211 19.2109 17.7024 19.0001 17.172 19H10C9.46957 19 8.96086 18.7893 8.58579 18.4142C8.21071 18.0391 8 17.5304 8 17V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-newmail" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M22 13V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V18C2 19.1 2.9 20 4 20H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 16V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 19H22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-package" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 22V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.29004 7L12 12L20.71 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 4.27002L16.5 9.42002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-pencil" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M21.1739 6.81201C21.7026 6.28344 21.9997 5.56648 21.9998 4.81887C21.9999 4.07125 21.703 3.35422 21.1744 2.82551C20.6459 2.29681 19.9289 1.99973 19.1813 1.99963C18.4337 1.99954 17.7166 2.29644 17.1879 2.82501L3.84193 16.174C3.60975 16.4055 3.43805 16.6905 3.34193 17.004L2.02093 21.356C1.99509 21.4425 1.99314 21.5344 2.01529 21.6219C2.03743 21.7094 2.08285 21.7892 2.14673 21.853C2.21061 21.9168 2.29055 21.9621 2.37809 21.9841C2.46563 22.0061 2.55749 22.004 2.64393 21.978L6.99693 20.658C7.3101 20.5628 7.59511 20.3921 7.82693 20.161L21.1739 6.81201Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 5L19 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-receipt-euro" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M4 2V22L6 21L8 22L10 21L12 22L14 21L16 22L18 21L20 22V2L18 3L16 2L14 3L12 2L10 3L8 2L6 3L4 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 12H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.9997 9.49998C15.4682 8.87861 14.7591 8.43505 13.9678 8.22903C13.1765 8.02301 12.3411 8.06443 11.5741 8.34771C10.8071 8.631 10.1453 9.14253 9.67794 9.81342C9.21054 10.4843 8.95996 11.2823 8.95996 12.1C8.95996 12.9176 9.21054 13.7156 9.67794 14.3865C10.1453 15.0574 10.8071 15.569 11.5741 15.8522C12.3411 16.1355 13.1765 16.1769 13.9678 15.9709C14.7591 15.7649 15.4682 15.3213 15.9997 14.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-sprout" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M14 9.536V7C14 5.93913 14.4214 4.92172 15.1716 4.17157C15.9217 3.42143 16.9391 3 18 3H19.5C19.6326 3 19.7598 3.05268 19.8536 3.14645C19.9473 3.24021 20 3.36739 20 3.5V5C20 6.06087 19.5786 7.07828 18.8284 7.82843C18.0783 8.57857 17.0609 9 16 9C14.9391 9 13.9217 9.42143 13.1716 10.1716C12.4214 10.9217 12 11.9391 12 13C12 15 13 16 13 18C13 19.0819 12.6491 20.1345 12 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M4 9C4.74285 8.44287 5.62616 8.1036 6.55097 8.02021C7.47578 7.93682 8.40554 8.1126 9.23607 8.52787C10.0666 8.94313 10.7651 9.58147 11.2533 10.3713C11.7414 11.1612 12 12.0714 12 13C11.2572 13.5571 10.3738 13.8964 9.44903 13.9798C8.52422 14.0632 7.59446 13.8874 6.76393 13.4721C5.9334 13.0569 5.23492 12.4185 4.74675 11.6287C4.25857 10.8388 4 9.92856 4 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 21H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-square-pen" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3751 2.62498C18.7729 2.22716 19.3125 2.00366 19.8751 2.00366C20.4377 2.00366 20.9773 2.22716 21.3751 2.62498C21.7729 3.02281 21.9964 3.56237 21.9964 4.12498C21.9964 4.68759 21.7729 5.22716 21.3751 5.62498L12.3621 14.639C12.1246 14.8762 11.8313 15.0499 11.5091 15.144L8.63609 15.984C8.55005 16.0091 8.45883 16.0106 8.372 15.9883C8.28517 15.9661 8.20592 15.9209 8.14254 15.8575C8.07916 15.7942 8.03398 15.7149 8.01174 15.6281C7.98949 15.5412 7.991 15.45 8.01609 15.364L8.85609 12.491C8.95062 12.169 9.12463 11.876 9.36209 11.639L18.3751 2.62498Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-target" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-thumb-down" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M8.99992 18.12L9.99992 14H4.16992C3.85943 14 3.55321 13.9277 3.27549 13.7889C2.99778 13.65 2.75622 13.4484 2.56992 13.2C2.38363 12.9516 2.25772 12.6633 2.20218 12.3578C2.14664 12.0523 2.16298 11.7381 2.24992 11.44L4.57992 3.44C4.70109 3.02457 4.95373 2.65964 5.29992 2.4C5.64611 2.14036 6.06718 2 6.49992 2H19.9999C20.5304 2 21.0391 2.21071 21.4141 2.58579C21.7892 2.96086 21.9999 3.46957 21.9999 4V12C21.9999 12.5304 21.7892 13.0391 21.4141 13.4142C21.0391 13.7893 20.5304 14 19.9999 14H17.2399C16.8678 14.0002 16.5032 14.1042 16.187 14.3003C15.8707 14.4964 15.6155 14.7768 15.4499 15.11L11.9999 22C11.5283 21.9942 11.0642 21.8818 10.6421 21.6714C10.2201 21.461 9.85099 21.1579 9.56252 20.7848C9.27404 20.4117 9.07361 19.9782 8.97618 19.5168C8.87876 19.0554 8.88688 18.5779 8.99992 18.12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17 14V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-ticket-percent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M2 9C2.79565 9 3.55871 9.31607 4.12132 9.87868C4.68393 10.4413 5 11.2044 5 12C5 12.7956 4.68393 13.5587 4.12132 14.1213C3.55871 14.6839 2.79565 15 2 15V17C2 17.5304 2.21071 18.0391 2.58579 18.4142C2.96086 18.7893 3.46957 19 4 19H20C20.5304 19 21.0391 18.7893 21.4142 18.4142C21.7893 18.0391 22 17.5304 22 17V15C21.2044 15 20.4413 14.6839 19.8787 14.1213C19.3161 13.5587 19 12.7956 19 12C19 11.2044 19.3161 10.4413 19.8787 9.87868C20.4413 9.31607 21.2044 9 22 9V7C22 6.46957 21.7893 5.96086 21.4142 5.58579C21.0391 5.21071 20.5304 5 20 5H4C3.46957 5 2.96086 5.21071 2.58579 5.58579C2.21071 5.96086 2 6.46957 2 7V9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 9H9.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 9L9 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 15H15.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-user-square" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M18 21C18 19.4087 17.3679 17.8826 16.2426 16.7574C15.1174 15.6321 13.5913 15 12 15C10.4087 15 8.88258 15.6321 7.75736 16.7574C6.63214 17.8826 6 19.4087 6 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-user" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 3.12805C16.8578 3.35042 17.6174 3.85132 18.1597 4.55211C18.702 5.25291 18.9962 6.11394 18.9962 7.00005C18.9962 7.88616 18.702 8.74719 18.1597 9.44799C17.6174 10.1488 16.8578 10.6497 16 10.8721" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>

</symbol>
<symbol id="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
<path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-broom" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M2 13L9 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.8 4.2C19.6 3.4 20.9 3.4 21.7 4.2C22.5 5 22.5 6.3 21.7 7.1L12.9 15.9L15.9 18.9L19.5 15.3L20.2 16C21.3 17.1 21.3 18.9 20.2 20C19.1 21.1 17.3 21.1 16.2 20L5 8.79998L8.79998 5L15.4 11.6L16.1 10.9L12.5 7.30002L15.5 4.30002L18.8 4.2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="icon-users-group" viewBox="0 0 24 24" fill="none" stroke="currentColor">
<path d="M17 21V19C17 17.9 16.6 17 15.9 16.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 21V19C9 17.9 9.4 17 10.1 16.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16 3.13001C16.86 3.35001 17.62 3.85001 18.16 4.55001C18.7 5.25001 19 6.11001 19 7.00001C19 7.89001 18.7 8.75001 18.16 9.45001C17.62 10.15 16.86 10.65 16 10.87" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.5 15.13C4.64 15.35 3.88 15.85 3.34 16.55C2.8 17.25 2.5 18.11 2.5 19V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="13" cy="7" r="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>

</svg>`;

export const loadSprite = () => {
    const div = document.createElement('div');
    div.innerHTML = sprite;
    document.body.insertBefore(div.firstChild, document.body.firstChild);
};
