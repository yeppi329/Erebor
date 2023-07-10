import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 500);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Button
      color="primary"
      variant="contained"
      size="large"
      startIcon={<KeyboardArrowUpIcon />}
      onClick={scrollToTop}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      Scroll to Top
    </Button>
  );
};

export default ScrollToTopButton;
// const ExamplePage = () => {
//   return (
//     <div>
//       <h1>Scrollable Content</h1>
//       <div style={{ height: '2000px', overflowY: 'scroll' }}>
//         <p>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus cursus odio a erat
//           luctus finibus. Donec aliquet dolor risus, at dapibus metus consectetur nec. Nam at enim
//           in ex fermentum gravida. Nam feugiat vestibulum ultrices. Nulla facilisi. Pellentesque
//           habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris
//           nec dapibus purus, eu tristique lectus. Curabitur commodo fermentum arcu a fermentum.
//           Phasellus interdum erat nec augue consequat, sed tincidunt nisl vestibulum. Vestibulum
//           nec massa vitae turpis fermentum tempor. Aenean bibendum dolor at metus tristique, id
//           suscipit urna scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et
//           ultrices posuere cubilia Curae; Integer eu tellus ac enim lobortis posuere. Fusce mauris
//           lectus, hendrerit eu metus at, mattis convallis mauris. Aliquam erat volutpat.
//         </p>
//         <p>
//           Sed viverra mi id aliquet interdum. Suspendisse vestibulum nunc ut venenatis ultrices.
//           Praesent dictum dui sit amet nisl rhoncus faucibus. Vestibulum dignissim feugiat turpis,
//           vitae tempor diam varius id. Sed vel malesuada velit. Integer tincidunt ultricies
//           convallis. Mauris nec nulla dapibus, rhoncus nisl ut, tincidunt mi. Aenean eget
//           consectetur lorem, in volutpat nulla. Aliquam vitae nulla leo. Suspendisse ullamcorper,
//           nunc et euismod rhoncus, lacus quam feugiat turpis, sed tincidunt arcu erat sed enim.
//           Proin ullamcorper, quam ac pellentesque mattis, justo nulla ultricies metus, eget
//           hendrerit lacus mauris vitae dui. Proin sagittis turpis eget lobortis commodo. Donec
//           venenatis diam at neque pulvinar, ac vestibulum mauris efficitur. Donec sit amet
//           vestibulum massa.
//         </p>
//       </div>
//       <ScrollToTopButton />
//     </div>
//   );
// };

// export default ExamplePage;
