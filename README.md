<hr>

<div align="center"> 

![Logo.png](./assets/logo.png)

</div>

<p align="center"> 
    Easily Generate XPath & CSS Selectors from the Chrome Dev-Tools
</p>

---

<br/>

<div align="center"> 
   
## Work In Progress

</div>

- [ ] CSS Selectors
    > Currently only XPath Selectors are generated, this is due to XPath Selectors being more powerful than css selectors, thus the focus mainly lies on XPath for now - CSS Selectors will be added soon.


<div align="center"> 

## Supported Generators

</div>

- Attributes
  > Generates Selectors based on the Nodes attributes, certain attributes are ignored.
  > Classes are also enumerated and a Markov-Chain search is performed to determine which classes are gibberish.

- Parent
  > Utilizes the "Attributes" Generator in conjunction with the parent node.