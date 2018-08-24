Use Cases
=========

View an existing blog
---------------------

Any user should be able, given the address of an OpenWit microblog contract, to view that feed.

Create a new blog linked to the OpenWitRegistry
-----------------------------------------------

The app is displaying is connected with a specific deployed OpenWit registry. You should be
able to create a new blog on that registry as long as you can afford to stake the blog (0.1 ether).

Add a new post to your blog
---------------------------

As the owner of a blog you can add new posts, assuming you have not locked it.

Lock your blog
--------------

You can lock your blog, which will stop the blog from accepting new posts. It will also disable ownership
transfer, but not destorying the blog. A locked blog can be unlocked by the owner.

Transfer ownership of your blog to another account
--------------------------------------------------

Assuming you are the owner, you can transfer the ownership of the blog to another account. You will
no longer be able to post or affect the blog; those powers transfer to the new owner.


Destroy your blog
-----------------

An owner always has the option of destroying the blog. This destroys the contract on the ethereum network,
and hence removes the pointer to the data (blog posts) on IPFS, but they may remain on IPFS, it is indellible so take care in what you post.

Report a blog in violation of the registries Code of Conduct
------------------------------------------------------------

TBD
