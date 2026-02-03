Java.perform(function () {
  console.log("[*] Script loaded");

  const DatabaseSecret = Java.use(
    "org.thoughtcrime.securesms.crypto.DatabaseSecret"
  );

  DatabaseSecret.asString.implementation = function () {
    const result = this.asString();
    console.log("[+] DatabaseSecret.asString() =", result);
    return result;
  };
});