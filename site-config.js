/* Site-wide settings. Edit here, then no other file needs touching.
   NEWSLETTER: leave `action` empty and no signup form is shown anywhere (no dead forms).
   To switch it on, paste your email provider's form-post URL into `action`
   (Buttondown, Kit/ConvertKit, MailerLite, Beehiiv and Mailchimp all give you one),
   set `emailName` to the email field name that provider expects, and add any hidden fields to `extra`.
   Then update privacy.html so it names the provider. */
window.SITE_CONFIG = {
  newsletter: {
    action: "",          // e.g. "https://buttondown.com/api/emails/embed-subscribe/YOURNAME"
    method: "post",
    emailName: "email",  // provider's field name for the address
    extra: {},           // hidden fields, e.g. {"embed": "1"}
    newTab: true         // open the provider's confirmation page in a new tab
  }
};
