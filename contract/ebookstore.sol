// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract EbookStore {
    address payable contractOwner;

    uint256 internal booksTotal = 0;

    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    constructor() {
        // set the contract owner when deploying the contract
        contractOwner = payable(msg.sender);
    }

    struct Book {
        string epubUrl;
        string coverUrl;
        string title;
        string author;
        uint256 price;
        uint256 sold;
    }

    // map all books
    mapping(uint256 => Book) internal books;

    // map books to user address
    mapping(address => mapping(uint256 => bool)) internal userBooks;

    // list of all books of an user
    mapping(address => uint256[]) internal userBookList;

    // add a book only if the sender is the contract owner
    function addBook(
        string memory _epubUrl,
        string memory _coverUrl,
        string memory _title,
        string memory _author,
        uint256 _price
    ) public {
        require(msg.sender == contractOwner, "Not contract owner");

        uint256 _sold = 0;
        books[booksTotal] = Book(
            _epubUrl,
            _coverUrl,
            _title,
            _author,
            _price,
            _sold
        );
        booksTotal++;
    }

    function buyBook(uint256 _index) public payable {
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                contractOwner,
                books[_index].price
            ),
            "Transfer failed"
        );

        require(_index < booksTotal, "Book not available");

        require(userBooks[msg.sender][_index] != true, "Already owns the book");

        require(
            msg.sender != contractOwner,
            "Contract owner can not buy books"
        );

        // increase number of sells for the book
        books[_index].sold++;

        // set user as owner of the book
        userBooks[msg.sender][_index] = true;

        // add book to user list
        userBookList[msg.sender].push(_index);
    }

    function getBooksTotal() public view returns (uint256) {
        return (booksTotal);
    }

    function getBookPublicDetails(uint256 _index)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        return (
            _index,
            books[_index].coverUrl,
            books[_index].title,
            books[_index].author,
            books[_index].price,
            books[_index].sold
        );
    }

    function getUserBooks() public view returns (uint256[] memory) {
        return (userBookList[msg.sender]);
    }

    function getBookEpub(uint256 _index) public view returns (string memory) {
        require(
            msg.sender == contractOwner ||
                userBooks[msg.sender][_index] == true,
            "Not contract owner or book owner"
        );

        return (books[_index].epubUrl);
    }
}
