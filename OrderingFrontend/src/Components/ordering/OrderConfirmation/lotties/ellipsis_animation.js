import { Box } from "@chakra-ui/react";

const LoopingEllipsis = () => {
  return (
    <Box as="span" display="inline">
      <Box as="span" animation="ellipsis1 1.5s infinite">.</Box>
      <Box as="span" animation="ellipsis2 1.5s infinite">.</Box>
      <Box as="span" animation="ellipsis3 1.5s infinite">.</Box>
      <style jsx>
        {`
          @keyframes ellipsis1 {
            0%, 20%, 100% {
              opacity: 0;
            }
            60% {
              opacity: 1;
            }
          }
          @keyframes ellipsis2 {
            0%, 60%, 100% {
              opacity: 0;
            }
            80% {
              opacity: 1;
            }
          }
          @keyframes ellipsis3 {
            0%, 80%, 100% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoopingEllipsis;
