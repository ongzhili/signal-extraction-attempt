# signal-extraction-attempt

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

Credits to [https://rado0z.github.io/Decrypt_Android_Database](rado0z) and [https://blog.knugi.com/202107/151300-Decrypting-Signal-Conversation-Database.html](KnugiHK)

We need 3 things.

### 1. `org.thoughtcrime.securesms_preferences.xml`
  - This is under `shared_prefs`
  - Look for `<string name="pref_database_encrypted_secret"> {<stuff here>} />`
  - `data` and `iv` are what you need
### 2. SignalSecret
  - As my emulator is running in Android 12+ (16), The keystore filesystem is different.
  - It is now a sqlite database under `/data/misc/keystore/persistent.sqlite`
<img width="828" height="148" alt="image" src="https://github.com/user-attachments/assets/1eb84d46-b12d-4eec-80ca-8beec4e5bbe8" />

- We obtain the id that corresponds to the alias `SignalSecret` in `keyentry` table.
- Then, we look for the blob with `keyentryid` corresponding to `id`.
  - Unfortunately, currently stuck here. Not sure which byte offset works (WIP)
  - I'm thinking of bruteforcing all possible 16 byte chunks in the blob.

#### 2.1 Cipher 

Image credit to [https://rado0z.github.io/Decrypt_Android_Database](rado0z)

<img width="1109" height="512" alt="image" src="https://raw.githubusercontent.com/Rado0z/Rado0z.github.io/master/assets/CyberChef.png" />

In theory we should simply be able to plug in the values in the same format to get the decrypted key.


# Running the application

```shell
$ docker compose build
$ docker compose up (-d) 
```

Access webpage via `localhost:5173`
Access API via `localhost:3000`
