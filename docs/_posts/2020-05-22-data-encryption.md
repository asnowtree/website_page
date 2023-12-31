---
title: 数据加密
author: Narule
date: 2020-05-22 23:10:00 +0800
categories: [technology]
tags: [writing, Algorithm, encryption, 加密]

---


# 网络数据加密

互联网，将全球不同的计算机等电子设备连接起来，使具备互相通信的条件，但是通信信息有些事隐私，有些通信不能被其他人知道。互联网私人生活交流信息不被恶意者随意窃取，也应该是社会秩序正常稳定的表现，平时的通信不过如此，涉及到商业信息，数据保密更显得格外重要。加密算法是保持通信信息不泄漏的一种技术，可用手段。''
<!--more-->
## 前言

### 网络数据加密是必须做的事

#### 安全正确必要性

互联网通信通过电缆或者无线设备，信息是可以被中间人收到记录的，所以要考虑很多风险因素，信息必须被加密处理只是其中之一的考虑

##### 信息安全

明文可能被第三方劫持查看。

就像写信一样，A写信给B，在信件到达B手上之前，信件在途中可能被别人拆开看过然后再封装原样，使AB都不能发觉信息已经被第三个人看了。 

##### 信息正确

传输信息可能被修改

同样A给B写信，在途中信件被人劫持，如果信件途中被别人打开，替换里面的信息内容，B收到后的信息很可能是错误的。



网络也是一样，网络通信必须通过有线或者无线设备传输，所以一定是可以劫持的，明文通信没有隐私可言，极不安全，所以加密算法通常需要做的事

## 概念

> 参考文章
>
> https://www.cnblogs.com/hulianwangjiagoushi/p/10671771.html

首先加密是因为存在网路信息传输，所以加密的使用过程分三步

举例 A计算机通过网络传输信息给B计算机，中间使用加密算法过程如下

A (明文 -->加密-->密文)   -----------网络（密文）-----------> B（密文 -->解密-->明文）



```flow
st=>start: 明文
op1=>operation: A端加密
op2=>operation: 加密密文网络传输
cond=>condition: 签名确认 是否为A端发送的加密数据?
op3=>operation: B端解密
op4=>operation: 丢弃（被篡改）信息
e=>end: 明文
st->op1->op2->cond
op3->e
cond(yes)->op3->e
cond(no)->op4

#cond=>condition: Yes or No?
#cond(yes)->e
#cond(no)->op
```
##### 密钥

用于加密的根据，明文加密成密文的凭据，根据密钥有规则的加密，也只有根据密钥才能有规则的解密，应此通信中加密的密钥保管也很重要（不能被泄露）

##### 明文

明文指两者通信的原文，能看懂的。

##### 加密

将明文通过某种方式加密变成密文

##### 密文

将明文加密后的信息，并且除了密钥，不能用其他方式将其解密成原文信息

##### 传输

密文的传输（不怕别人看到密文，密文看不到真实信息，第三方不能获取有效信息）

##### 解密

将密文还原成明文（接收者能看到明文）

##### 签名

保证双方的信息真实没被修改的技术

A与B之间要有一种签名存在，在通信的时候，收到信息，通过签名要能鉴别信息是否被第三方修改或者信息是第三方伪造发送。

# 加密算法

信息加密是非常专业的计算知识，通过复杂设计，对信息数据加密，使不能被轻易破解。常见的加密算法都需要有密钥，通过密钥分类又可以分为对称加密和非对称加密。

对称加密指信息的加密和解密使用同一个密钥，非对称加密则是信息的加密和解密不是用到同一个密钥

## 对称加密

### AES

>密码学中的高级加密标准（Advanced Encryption Standard，AES）
>
>这个标准用来替代原先的[DES](https://baike.baidu.com/item/DES)（Data Encryption Standard），已经被多方分析且广为全世界所使用。经过五年的甄选流程，高级加密标准由美国国家标准与技术研究院 （NIST）于2001年11月26日发布于FIPS PUB 197，并在2002年5月26日成为有效的标准。2006年，高级加密标准已然成为对称密钥加密中最流行的算法之一 [1] 。
>
>该算法为比利时密码学家Joan Daemen和Vincent Rijmen所设计，结合两位作者的名字，以Rijdael之名命之，投稿高级加密标准的甄选流程。（Rijdael的发音近于 "Rhine doll"。）

#### 原理

> AES加密数据块和密钥长度可以是128b、192b、256b中的任意一个。AES加密有很多轮的重复和变换。大致步骤如下：①密钥扩展（Key Expansion)；②初始轮（InitialRound)；③重复轮（Rounds），每一重复轮又包括字节间减法运算（SubBytes）、行移位（ShiftRows）、列混合（MixColumns)、轮密钥加法运算（AddRoundKey)等操作；①最终轮（Final Round)，最终轮没有列混合操作（MixColumns)。

##### 相关文章介绍：

https://blog.csdn.net/zxh2075/article/details/80630296

https://www.jianshu.com/p/79a225c2650e

https://blog.csdn.net/huangxiaoguo1/article/details/78043169

#### 加密过程

128位密钥加密流程简略描述：

```flow
st=>start: 待加密明文
op0=>operation: 明文与密钥异或运算
op1=>operation: 获取加密密钥，设置填充方式
op2=>operation: 加密（信息+密钥 规律运算）
cond1=>condition: 循环了9次？
op3=>operation: 第十次加密运算（区别于前面9次）
op4=>operation: （明文+密钥）规律位运算调整
e=>end: AES加密密文

st->op0->op2->cond1
op3->e
cond1(yes)->op3
cond1(no)->op4->op2


```



#### 解密（逆运算）

因为明文加密10轮是根据密钥有规律的复杂运算，因此解密就是上述过程的逆运算，只要有密钥，就能通过规律逆运算得到明文

#### 加密模式

> 对称/[分组密码](https://baike.baidu.com/item/分组密码)一般分为流加密(如OFB、CFB等)和块加密(如ECB、CBC等)。对于流加密，需要将分组密码转化为流模式工作。对于块加密(或称分组加密)，如果要加密超过块大小的数据，就需要涉及填充和链加密模式。



##### ECB

> ECB(Electronic Code Book电子密码本)模式
>
> ECB模式是最早采用和最简单的模式，它将加密的数据分成若干组，每组的大小跟加密密钥长度相同，然后每组都用相同的密钥进行加密。



##### CBC

> CBC(Cipher Block Chaining，加密块链)模式
>
> 这种模式是先将明文切分成若干小段，然后每一小段与初始块或者上一段的密文段进行异或运算后，再与密钥进行加密。

#### java使用AES加密

##### AesCrypto.java

```java
package com.emoyc.note.common.util.encryption.aes;


import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * AES加密
 * @author Narule
 *
 */
public class AesCrypto {
	
	/**
	 * AES加密模式
	 */
	
	private static final String ECB_MODE = "AES/ECB/PKCS5Padding";

	private static final String CBC_MODE = "AES/CBC/PKCS5Padding";
	
	
	/**
	 * AES ECB模式加密
     * @param content 待加密的内容 
     * @param encryptKey 加密密钥 
     * @return 加密后的byte[] 
     * @throws Exception 
     */  
    public static byte[] aesEncryptToBytes_ECB(byte[] contentBytes, byte[] keyBytes) throws Exception {  
        KeyGenerator kgen = KeyGenerator.getInstance("AES");  
        kgen.init(128);  
        Cipher cipher = Cipher.getInstance(ECB_MODE);  
        cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(keyBytes, "AES"));  
        return cipher.doFinal(contentBytes);
    } 
	
	/**
	 * AES ECB模式解密
	 * @param encryptBytes 待解密的byte[] 
     * @param decryptKey 解密密钥 
     * @return 解密后的String 
     * @throws Exception 
     */  
    public static byte[] aesDecryptByBytes_ECB(byte[] encryptBytes, byte[] keyBytes) throws Exception {  
        KeyGenerator kgen = KeyGenerator.getInstance("AES");  
        kgen.init(128);
        Cipher cipher = Cipher.getInstance(ECB_MODE);  
        cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(keyBytes, "AES"));  
        return cipher.doFinal(encryptBytes);
    }  
	
    
	
	/**
	 * AES CBC模式加密
	 * @throws Exception 
	 */
    public static byte[] aesEncryptToBytes_CBC(byte[] encryptBytes, byte[] ivBytes,byte[] keyBytes) throws Exception {
		SecretKeySpec key = new SecretKeySpec(keyBytes, "AES");
		IvParameterSpec IV = new IvParameterSpec(ivBytes);
		Cipher c = Cipher.getInstance(CBC_MODE);
		c.init(Cipher.ENCRYPT_MODE, key, IV);
		return c.doFinal(encryptBytes);
	}
	
	/**
	 * AES CBC模式解密
	 * @throws Exception 
	 */
    public static byte[] aesDecryptByBytes_CBC(byte[] decryptBytes, byte[] ivBytes,byte[] keyBytes) throws Exception {  
    	SecretKeySpec key = new SecretKeySpec(keyBytes, "AES");
		IvParameterSpec IV = new IvParameterSpec(ivBytes);
    	Cipher c = Cipher.getInstance(CBC_MODE);
        c.init(Cipher.DECRYPT_MODE, key, IV);
        return c.doFinal(decryptBytes); 
    } 
    
}

```



##### AesUtil.java


```java
package com.emoyc.note.common.util.encryption.aes;


/**
 * AES 加密整合工具类
 * @author Narule
 *
 */
public class AesUtil {
	
	/**
	 * AES临时KEY
	 */
	private static final String KEY = "jdkcnvlao903nhfl";
	
	
	/**
	 * AES-ECB 加密模式
	 * @param content //原文
	 * @param key
	 * @return _encrypt //密文
	 * @throws Exception
	 */
	public final static String aesEncrypt_ECB(String content,String key) throws Exception {
		return base64Encode(
					AesCrypto.aesEncryptToBytes_ECB(content.getBytes(), key.getBytes())
				);
	}
	
	/**
	 * AES-ECB 解密模式
	 * @param content //密文
	 * @param key
	 * @return _decrypt //原文
	 * @throws Exception
	 */
	public final static String aesDecrypt_ECB(String content,String key) throws Exception {
		return new String(
					AesCrypto.aesDecryptByBytes_ECB(base64Decode(content), key.getBytes())
				);
	}
	
	/**
	 * AES-CBC 加密模式
	 * @param content //原文
	 * @param key
	 * @return _encrypt //密文
	 * @throws Exception
	 */
	public final static String aesEncrypt_CBC(String content,String key) throws Exception {
		
		return base64Encode(
					AesCrypto.aesEncryptToBytes_CBC(content.getBytes(), key.getBytes(),key.getBytes())
				);
	}
	
	/**
	 * AES-CBC 解密模式
	 * @param content //密文
	 * @param key
	 * @return _decrypt //原文
	 * @throws Exception
	 */
	public final static String aesDecrypt_CBC(String content,String key) throws Exception {
		return new String(
					AesCrypto.aesDecryptByBytes_CBC(base64Decode(content), key.getBytes(), key.getBytes())
				);
	}
	
	
	 /** 
     * base 64 encode 
     * @param bytes 待编码的byte[] 
     * @return 编码后的base 64 code 
     */  
    public static String base64Encode(byte[] bytes){  
    	return java.util.Base64.getEncoder().encodeToString(bytes);
    }  
  
    /** 
     * base 64 decode 
     * @param base64Code 待解码的base 64 code 
     * @return 解码后的byte[] 
     * @throws Exception 
     */  
    public static byte[] base64Decode(String base64Code) throws Exception{  
    	 return (base64Code == null || base64Code.length() == 0) ? null : java.util.Base64.getDecoder().decode(base64Code);
    }
    
    
    
    
    
    
    
    
    
    
    public static void main(String[] args) {
    	String string = "吴楠予";
		testAes_ECB(string);
		testAes_CBC(string);
	}

	private static void testAes_ECB(String string) {
		System.out.println("===================ECB加密=================");
		System.out.println("明文：" );
		System.out.println(string);
		String aesEncrypt_ECB = null;
		String aesDecrypt_ECB = null;
		try {
			aesEncrypt_ECB = aesEncrypt_ECB(string, KEY);
			System.out.println("密文：");
			System.out.println(aesEncrypt_ECB);
			aesDecrypt_ECB = aesDecrypt_ECB(aesEncrypt_ECB, KEY);
			System.out.println("解密后：");
			System.out.println(aesDecrypt_ECB);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static void testAes_CBC(String string) {
		System.out.println("===================CBC加密=================");
		System.out.println("明文：" );
		System.out.println(string);
		String aesEncrypt_CBC = null;
		String aesDecrypt_CBC = null;
		try {
			aesEncrypt_CBC = aesEncrypt_CBC(string, KEY);
			System.out.println("密文：");
			System.out.println(aesEncrypt_CBC);
			aesDecrypt_CBC = aesDecrypt_CBC(aesEncrypt_CBC, KEY);
			System.out.println("解密后：");
			System.out.println(aesDecrypt_CBC);
		} catch (Exception e) {
			e.printStackTrace();
		}
	} 
    
}
```





##### 加解密Test

运行AesUtil的main方法：

![](https://img2020.cnblogs.com/blog/1436620/202005/1436620-20200522141411759-2056476981.png)


## 非对称加密

### RSA

> 参考文章
>
> http://www.ruanyifeng.com/blog/2013/06/rsa_algorithm_part_one.html
>
> http://www.ruanyifeng.com/blog/2013/07/rsa_algorithm_part_two.html
>
> https://www.jianshu.com/p/ca659dbc6f46

通过上面的文章自己实践测试，数字小，但是不影响

```

p = 3 q = 5

n = 3 * 5 = 15

n' = 2 * 4 = 8

选一个数 e  与 8 互质 
e = 7

7 * x + 8 * y = 1

x = 7 = d
y = -6


加密 3

3^7 = 2187

2187%15  = 12

12^7%15 = 3



e = ３

3 * x + 8 * y = 1

x = 11 = d
y = -4


加密 3

3^3 = 27

27%15  = 12

12^11%15 = 3
```



#### java使用RSA加密工具



##### RsaUtil.java

```java
package com.emoyc.note.common.util.encryption.rsa;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyPair;

/**
 * RSA 加密工具整合类
 * @author Narule
 *
 */

public class RsaUtil {
	
	private static byte[] publicKey;
	private static byte[] privateKey;

	/**
	 * main方法 - RSA 加密解密测试
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		createKey();
		initKey();
		String str = "吴楠予";
		byte[] encryptData = RsaCrypto.encryptData(str.getBytes(), publicKey);
		System.out.println("=========加密===============");
		System.out.println(new String(encryptData));
		System.out.println("=========解密===============");
		byte[] decryptData = RsaCrypto.decryptData(encryptData, privateKey);
		System.out.println(new String(decryptData));
	}
	
	/**
	 * createKey 创建RSA 密钥对
	 */
	private static void createKey() {
    	try {
    		KeyPair generateKeyPair = RsaCrypto.creatKey();
    		byteToFile(generateKeyPair.getPublic().getEncoded(), "./rsa_2048_pubkey.txt");
    		byteToFile(generateKeyPair.getPrivate().getEncoded(), "./rsa_2048_prikey.txt");
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    }
	
	public static KeyPair getOneRsaKey() {
    	try {
    		return RsaCrypto.creatKey();
    	} catch (Exception e) {
    		e.printStackTrace();
    	}
    	return null;
    }
	/**
	 * readKey 读取密钥文件
	 */
	private static void initKey() {
		try {
			publicKey =  fileToByte("./rsa_2048_pubkey.txt");
			privateKey =  fileToByte("./rsa_2048_prikey.txt");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
    
    
    
    /**
     * byte->file 二进制数据转文件
     * @param bytes
     * @param filePath
     * @throws Exception
     */
    public static void byteToFile(byte[] bytes, String filePath) throws Exception {
        InputStream in = new ByteArrayInputStream(bytes);
        File destFile = new File(filePath);
        if (!destFile.getParentFile().exists()) {
            destFile.getParentFile().mkdirs();
        }
        destFile.createNewFile();
        OutputStream out = new FileOutputStream(destFile);
        byte[] cache = new byte[2048];
        int nRead = 0;
        while ((nRead = in.read(cache)) != -1) {
            out.write(cache, 0, nRead);
            out.flush();
        }
        out.close();
        in.close();
    }
    
    
    /**
     * file->byte 文件转二进制
     * @param filePath
     * @return
     * @throws Exception
     */
    public static byte[] fileToByte(String filePath) throws Exception {
        byte[] data = new byte[0];
        File file = new File(filePath);
        if (file.exists()) {
            FileInputStream in = new FileInputStream(file);
            ByteArrayOutputStream out = new ByteArrayOutputStream(2048);
            byte[] cache = new byte[2048];
            int nRead = 0;
            while ((nRead = in.read(cache)) != -1) {
                out.write(cache, 0, nRead);
                out.flush();
            }
            out.close();
            in.close();
            data = out.toByteArray();
        }
        return data;
    }
}

```

##### RsaCrypto.java

```java
package com.emoyc.note.common.util.encryption.rsa;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.Cipher;


/**
 * RSA 加密解密类
 * @author Narule
 *
 */
public class RsaCrypto {

	private static final String ALGORITHM_RSA = "RSA";

	/** */
	/**
	 * RSA最大加密明文大小
	 */
	// 2048
	private static final int MAX_ENCRYPT_BLOCK = 245;

	/** */
	/**
	 * RSA最大解密密文大小
	 */
	// 2048
	private static final int MAX_DECRYPT_BLOCK = 256;


	
	public static KeyPair creatKey() throws Exception {
		KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(ALGORITHM_RSA);
		keyPairGenerator.initialize(2048);
		return keyPairGenerator.generateKeyPair();
	}
	
	
	/**
	 * RSA 公钥加密
	 * 
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] encryptData(byte[] data, byte[] key) {
		ByteArrayOutputStream out = null;
		byte[] encryptedData = null;
		try {
			X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(key);
			KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM_RSA);
			PublicKey generatePublic = keyFactory.generatePublic(x509KeySpec);

			// 对数据加密
			Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
			cipher.init(Cipher.ENCRYPT_MODE, generatePublic);
			int inputLen = data.length;
			out = new ByteArrayOutputStream();
			int offSet = 0;
			byte[] cache;
			int i = 0;
			// 对数据分段加密
			while (inputLen - offSet > 0) {
				if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
					cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
				} else {
					cache = cipher.doFinal(data, offSet, inputLen - offSet);
				}
				out.write(cache, 0, cache.length);
				i++;
				offSet = i * MAX_ENCRYPT_BLOCK;
			}
			encryptedData = out.toByteArray();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 防止流未关闭 浪费占用资源
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return encryptedData;
	}

	/**
	 * RSA 私钥解密
	 * 
	 * @param data
	 * @param key
	 * @return
	 * @throws Exception
	 */
	public static byte[] decryptData(byte[] data, byte[] key) {
		ByteArrayOutputStream out = null;
		byte[] decryptedData = null;
		try {
			PKCS8EncodedKeySpec pkcs8KeySpec = new PKCS8EncodedKeySpec(key);
			KeyFactory keyFactory = KeyFactory.getInstance(ALGORITHM_RSA);
			Key privateK = keyFactory.generatePrivate(pkcs8KeySpec);
			Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
			cipher.init(Cipher.DECRYPT_MODE, privateK);
			out = new ByteArrayOutputStream();
			int inputLen = data.length;
			int offSet = 0;
			byte[] cache;
			int i = 0;
			// 对数据分段解密
			while (inputLen - offSet > 0) {
				if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
					cache = cipher.doFinal(data, offSet, MAX_DECRYPT_BLOCK);
				} else {
					cache = cipher.doFinal(data, offSet, inputLen - offSet);
				}
				out.write(cache, 0, cache.length);
				i++;
				offSet = i * MAX_DECRYPT_BLOCK;
			}
			decryptedData = out.toByteArray();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// 防止流未关闭 浪费占用资源
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return decryptedData;
	}

}

```





## 其他
