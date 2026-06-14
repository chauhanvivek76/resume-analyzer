from fastapi import HTTPException, status


class PDFExtractionError(Exception):
    """Raised when PDF text extraction fails."""


class FileTooLargeError(Exception):
    """Raised when uploaded file exceeds size limit."""


class InvalidFileTypeError(Exception):
    """Raised when uploaded file type is not supported."""


def pdf_extraction_http_error(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=detail,
    )


def bad_request(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
