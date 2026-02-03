# signal-extraction-attempt
## Overview

2 Parts
- Obtaining the decryption key for the db
- A fullstack web app to view the messages

## Part 1: Extract Messages
Extracting key and decrypting database: WIP

Done using Android Studio: Android 16, Signal 7.71.2

If powershell: replace `adb` with `adb.exe`

## 1. To get root access: run `adb root`
## 2. To open a shell: `adb shell`
## 3. To access Signal's system files: `cd /data/data/org.thoughtcrime.securesms/`
## 4. To extract these files:

```shell
cp -r * /sdcard/<your-folder-name>.tar.gz
exit

adb pull /sdcard/<your-folder-name>.tar.gz
```

Then simply move this to your workspace and extract it.

## 5. Decrypting the database (by extracting key)

### Attempt 2: Frida

Requirements:
- `adb` (`brew install android-platform-tools`) (or whatever equivalent is present in linux)
- `Frida Tools`
- `frida-server-<version>-<architecture>.xz`
  - Make sure `version` is the same as `frida`

1. Setting up `frida-server`

```shell
$ xz -d frida-server-.....-.xz
$ mv frida-server-..... frida-server (for convenience)
$ adb push frida-server /data/local/tmp/frida-server
$ adb shell
$ chmod 755 /data/local/tmp/frida-server
$ /data/local/tmp/frida-server & (& just lets it run in the background so that you can use the same shell)
```

Checking if it works:

- Run `frida-ps -U`. You should see a process list - That means Frida server is setup properly.
  - Common issues:
    - `Unable to load SELinux policy from the kernel: Failed to open file ?/sys/fs/selinux/policy?: Permission denied`
      - `su` before running the `chmod` command and you should be good.  

<img width="681" height="564" alt="image" src="https://github.com/user-attachments/assets/29e3c0b6-8a52-418e-b725-1142cb6f2205" />

We simply observe from the Signal-Android source code that:
- The database decryption key is in `app/src/main/java/org/thoughtcrime/securesms/crypto/DatabaseSecret.java`
  - Thus, we can obtain the database decryption key simply by running a script via Frida. (refer to `extraction.js`)
  - We run via the following command: `frida -U -f org.thoughtcrime.securesms -l <script>.js` (In this case, `extraction.js`).
  - Key functions to observe:
    - `asString()` returns the encoded bytes
    - `asBytes()` returns the raw bytes
  - Thus, our script simply looks for DatabaseSecret in runtime and logs the value of DatabaseSecret.asString(); 

#### Attempt 2.1: Disabling encryption

<img width="663" height="181" alt="image" src="https://github.com/user-attachments/assets/15a04525-c1f7-4d82-9788-a777c1c6ef7d" />

- We observe from the source code in `app/src/main/java/org/thoughtcrime/securesms/database/SqlCipherDatabaseHook.java` that:
  - We note the PRAGMA `kdf_iter = 1` and `page_size = 4096`. We can set these and `SHA1` in SQLCipher DB browser to view the database entries.
  - We will need to use these PRAGMAs along with the key to programatically open the database though.
 
<img width="754" height="387" alt="image" src="https://github.com/user-attachments/assets/c717873e-b0a8-46f2-88e4-33f03ce631ec" />

- We open the database via DB Browser (SQLCipher) and enter the keys and the PRAGMAS as per image above:


<img width="833" height="382" alt="image" src="https://github.com/user-attachments/assets/3d4eee66-d9fa-4e86-a7d0-175e6573b608" />

We then open `Tools` -> `Set Encryption` and leave the password as blank. This removes the database encryption, and we can then use it for our viewer.
- Had issues setting the PRAGMAs to open the database via any js library, so removing the encryption was a workaround solution.




#### Failed Attempts

<del>
Credits to [rado0z](https://rado0z.github.io/Decrypt_Android_Database) and [KnugiHK](https://blog.knugi.com/202107/151300-Decrypting-Signal-Conversation-Database.html)

We need 3 things.

### 1. `org.thoughtcrime.securesms_preferences.xml`
  - This is under `shared_prefs`
  - Look for `<string name="pref_database_encrypted_secret"> {<stuff here>} />`
  - `data` and `iv` are what you need
### 2. SignalSecret
  - As my emulator is running in Android 12+ (16), The keystore filesystem is different.
  - It is now a sqlite database under `/data/misc/keystore/persistent.sqlite`

- We obtain the id that corresponds to the alias `SignalSecret` in `keyentry` table.
- Then, we look for the blob with `keyentryid` corresponding to `id`.
  - Unfortunately, currently stuck here. Not sure which byte offset works (WIP)
  - I'm thinking of bruteforcing all possible 16 byte chunks in the blob.
    - Did not seem to work.


#### 2.1 Cipher 

Image credit to [rado0z](https://rado0z.github.io/Decrypt_Android_Database)

`<img width="1109" height="512" alt="image" src="https://raw.githubusercontent.com/Rado0z/Rado0z.github.io/master/assets/CyberChef.png" />`

In theory we should simply be able to plug in the values in the same format to get the decrypted key.

</del>

## Part 2: Running the application

```shell
$ docker compose build
$ docker compose up (-d) 
```

Access webpage via `localhost:5173`
Access API via `localhost:3000`
