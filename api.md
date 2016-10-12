## Members

<dl>
<dt><a href="#createMessageID">createMessageID</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#createShortMessageID">createShortMessageID</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#createMessage">createMessage</a> ⇒ <code>object</code></dt>
<dd><p>This is a helper function which helps format a UMF style message.
             The caller is responsible for ensuring that required fields such as
             &quot;to&quot;, &quot;from&quot; and &quot;body&quot; are provided either before or after using
             this function.</p>
</dd>
<dt><a href="#createMessageShort">createMessageShort</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#toObject">toObject</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#toJSON">toJSON</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#toShort">toShort</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#toLong">toLong</a> ⇒ <code>object</code></dt>
<dd></dd>
<dt><a href="#validateMessage">validateMessage</a> ⇒ <code>boolean</code></dt>
<dd></dd>
<dt><a href="#getMessageBody">getMessageBody</a> ⇒ <code>object</code></dt>
<dd></dd>
</dl>

<a name="createMessageID"></a>

## createMessageID ⇒ <code>string</code>
**Summary**: Returns a UUID for use with messages  
**Returns**: <code>string</code> - uuid - UUID  
<a name="createShortMessageID"></a>

## createShortMessageID ⇒ <code>string</code>
**Summary**: Returns a short form UUID for use with messages  
**Returns**: <code>string</code> - uuid - UUID  
<a name="createMessage"></a>

## createMessage ⇒ <code>object</code>
This is a helper function which helps format a UMF style message.
             The caller is responsible for ensuring that required fields such as
             "to", "from" and "body" are provided either before or after using
             this function.

**Summary**: Create a UMF style message.  
**Returns**: <code>object</code> - message - a UMF formatted message.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| message | <code>object</code> |  | optional message overrides. |
| [shortFormat] | <code>boolean</code> | <code>false</code> | optional flag to use UMF short form syntax. |

<a name="createMessageShort"></a>

## createMessageShort ⇒ <code>object</code>
**Summary**: createMessage with short fields  
**Returns**: <code>object</code> - message - a UMF formatted short-form message.  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | optional message overrides. |

<a name="toObject"></a>

## toObject ⇒ <code>object</code>
**Returns**: <code>object</code> - unproxied message object  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | message to be converted |

<a name="toJSON"></a>

## toJSON ⇒ <code>string</code>
**Returns**: <code>string</code> - JSON version of message  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | message to be converted |

<a name="toShort"></a>

## toShort ⇒ <code>object</code>
**Summary**: convert a long message to a short one  
**Returns**: <code>object</code> - converted message  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | message to be converted |

<a name="toLong"></a>

## toLong ⇒ <code>object</code>
**Summary**: convert a short message to a long one  
**Returns**: <code>object</code> - converted message  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | message to be converted |

<a name="validateMessage"></a>

## validateMessage ⇒ <code>boolean</code>
**Summary**: Validates that a UMF message has required fields  
**Returns**: <code>boolean</code> - response - returns true is valid otherwise false  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | UMF formatted message |

<a name="getMessageBody"></a>

## getMessageBody ⇒ <code>object</code>
**Summary**: Return the body from a UMF message  
**Returns**: <code>object</code> - body - UMF message body  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>object</code> | UMF message |

